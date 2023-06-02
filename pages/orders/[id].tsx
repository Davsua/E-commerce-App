import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { getSession } from 'next-auth/react';
import { dbOrders } from '<@davsua>/database';
import { IOrder } from '<@davsua>/interfaces';
import { Product } from '<@davsua>/models';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  //console.log(order);

  return (
    <ShopLayout title='Orden 152455222' pageDescription='Orden 212523'>
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
              <Typography variant='h2'>
                Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />

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
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label='Orden ya fue pagada'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <h1>Pagar</h1>
                )}
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
