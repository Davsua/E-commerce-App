import React, { useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { AdminLayout, ShopLayout } from '<@davsua>/components/layouts';

import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
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

const OrderPage: NextPage<Props> = ({ order }) => {
  //console.log(order)

  return (
    <AdminLayout
      title='Resumen de la orden'
      subTitle={`OrdenId: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
    >
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
                <Box display='flex' flexDirection='column'>
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
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const id = query.id!;

  const session: any = await getSession({ req });

  //confirmar si la session es la correcta
  const order = await dbOrders.getOrderById(id.toString());

  //console.log({ session, order });

  if (!order) {
    return {
      redirect: {
        destination: `admin/orders`,
        permanent: false,
      },
    };
  }

  //console.log(session.user.role);
  // solo el admin puede ver todas las ordenes hechas
  if (session.user.role !== 'admin') {
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
