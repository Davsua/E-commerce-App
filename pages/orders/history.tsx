import { ShopLayout } from '<@davsua>/components/layouts';
import React from 'react';
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
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
        <Link href={`/orders/${params.row.id}`} underline='always'>
          Ver orden
        </Link>
      );
    },
  },
];

const rows = [
  { id: 1, paid: false, fullname: 'David Suarez', order: '#orden' },
  { id: 2, paid: true, fullname: 'Hola 123', order: '#orden' },
  { id: 3, paid: true, fullname: 'Hola 525', order: '#orden' },
  { id: 4, paid: false, fullname: 'Hola 2444', order: '#orden' },
  { id: 5, paid: true, fullname: 'Hola 5277', order: '#orden' },
  { id: 6, paid: true, fullname: 'Hola 2757', order: '#orden' },
];

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes'>
      <Typography variant='h1' component='h1'>
        Historial de Ordenes
      </Typography>

      <Grid container>
        <Grid xs={12} sx={{ height: 650, width: '100%' }} item>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPage;
