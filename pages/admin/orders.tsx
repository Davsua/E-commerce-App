import { AdminLayout } from '<@davsua>/components/layouts';
import { IOrder, IUser } from '<@davsua>/interfaces';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 300 },
  { field: 'total', headerName: 'Monto total', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant='outlined' label='Pagada' color='success' />
      ) : (
        <Chip variant='outlined' label='Pendiente' color='error' />
      );
    },
  },
  { field: 'NoProducts', headerName: 'N° Productos', align: 'center' },
  {
    field: 'check',
    headerName: 'Ver Orden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='blank'>
          Ver Orden
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Creada en', width: 250 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  if (!data && !error) {
    <></>;
  }

  //console.log(orders[0]);

  const rows = orders.map((order) => ({
    id: order._id,
    email: (order.user as IUser)?.email,
    name: (order.user as IUser)?.name,
    total: order.total,
    isPaid: order.isPaid,
    NoProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={'Ordenes'}
      subTitle={'Mantenimiento de ordenes'}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className='fadeIn'>
        <Grid xs={12} sx={{ height: 650, width: '100%' }} item>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
