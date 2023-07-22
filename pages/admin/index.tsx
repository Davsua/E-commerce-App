import { SummaryTile } from '<@davsua>/components/admin';
import { AdminLayout } from '<@davsua>/components/layouts';
import { DashBoardSummaryResponse } from '<@davsua>/interfaces';
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const DashBoardPage = () => {
  const { data, error } = useSWR<DashBoardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // actualiza cada 30 seg
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data;

  return (
    <AdminLayout title='DashBoard' subTitle='Estadisticas Generales' icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle='Ordenes totales'
          icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subTitle='Ordenes pagadas'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subTitle='Ordenes pendientes'
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subTitle='Clientes'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subTitle='Productos'
          icon={<CategoryOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithNoInventory}
          subTitle='Sin existencia'
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={lowInventory}
          subTitle='Bajo inventario'
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={refreshIn}
          subTitle='Actualizacion en:'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashBoardPage;
