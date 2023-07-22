import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '<@davsua>/components/layouts';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { getSession } from 'next-auth/react';
import { dbOrders } from '<@davsua>/database';
import { IOrder } from '<@davsua>/interfaces';
//import {  } from '@mui/x-data-grid/models';

// Hecha con Grid x --> https://mui.com/x/react-data-grid/getting-started/#main-content

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },

  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'muestra info si la orden esta pagada o no',
    width: 200,
    renderCell: (params) => {
      return params.row.paid ? (
        <Chip color='success' label='pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No pagada' variant='outlined' />
      );
    },
  },

  {
    field: 'order',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <Link href={`/orders/${params.row.orderId}`} underline='always'>
          Ver orden
        </Link>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  //console.log(orders);

  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      paid: order.isPaid,
      fullname: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
      orderId: order._id,
    };
  });

  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes'>
      <Typography variant='h1' component='h1'>
        Historial de Ordenes
      </Typography>

      <Grid container className='fadeIn'>
        <Grid xs={12} sx={{ height: 650, width: '100%' }} item>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  //console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=orders/history',
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);
  //console.log(orders);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
