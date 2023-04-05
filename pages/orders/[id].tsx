import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const OrderPage = () => {
  return (
    <ShopLayout title='Orden 152455222' pageDescription='Orden 212523'>
      <Typography variant='h1' component='h1'>
        Orden 1526625
      </Typography>

      {/*<Chip
        sx={{ my: 2 }}
        label='Pendiente de pago'
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined />}
      />*/}
      <Chip
        sx={{ my: 2 }}
        label='Orden ya fue pagada'
        variant='outlined'
        color='success'
        icon={<CreditScoreOutlined />}
      />

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen (3 Productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                <Link underline='always' href='/checkout/address'>
                  Editar
                </Link>
              </Box>

              <Typography>David Suarez</Typography>
              <Typography>calle 31 </Typography>
              <Typography>Envigado, ANT</Typography>
              <Typography>CO</Typography>
              <Typography>+57 555555555</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <Link underline='always' href='/cart'>
                  Editar
                </Link>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label='Orden ya fue pagada'
                  variant='outlined'
                  color='success'
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
