import React, { useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';

import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { dbOrders } from '<@davsua>/database';
import { IOrder } from '<@davsua>/interfaces';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { tesloApi } from '<@davsua>/api';
import { useRouter } from 'next/router';

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED' | 'CREATED';
};

const OrderPage: NextPage<Props> = ({ order }) => {
  //console.log(order);

  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    //console.log(details.status);
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en PayPal');
    }

    setIsPaying(true);

    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      //recargar pagina
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert('Error');
    }
  };

  return (
    <ShopLayout title='Resumen de la Orden' pageDescription={`Orden: ${order._id}`}>
      <Typography variant='h1' component='h1'>
        Orden: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='Orden ya fue pagada'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pendiente de pago'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}

      {/* Cart list */}
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h1'>
                Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
                Dirección de entrega
              </Typography>

              <Typography>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </Typography>
              <Typography>
                {order.shippingAddress.address}{' '}
                {order.shippingAddress.address2 ? order.shippingAddress.address2 : ''}
              </Typography>
              <Typography>{order.shippingAddress.city}</Typography>
              <Typography>{order.shippingAddress.country}</Typography>
              <Typography>{order.shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                totalOrder={order.total}
                subtotalOrder={order.subTotal}
                taxOrder={order.tax}
                NumberItemsOrder={order.numberOfItems}
              />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  justifyContent='center'
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex' }}>
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Orden ya fue pagada'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      //crea la orden (monto a pagar, etc... muchos datos son posibles de poner)
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          //console.log({ details });
                          onOrderCompleted(details);
                          /* con el id se confirmara en backend que ya se pago https://prnt.sc/mqtwHgo2u2wA*/
                          //const name = details.payer.name!.given_name;
                          //alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const id = query.id!;

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  //confirmar si la session es la correcta
  const order = await dbOrders.getOrderById(id.toString());

  //console.log({ session, order });

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  // order.user = id del usuario
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
