import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';
import { CartContext } from '<@davsua>/context';
import { countries } from '<@davsua>/utils';
import { RouteRounded } from '@mui/icons-material';
import { Button, Card, CardContent, Divider, Grid, Link, Typography, Chip } from '@mui/material';
import { Box } from '@mui/system';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

const SummaryOrder = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, [router]);

  const onCreateOrder = async () => {
    // evitar doble posteo de la orden
    setIsPosting(true);
    const { hasError, message } = await createOrder();

    // si hay un error
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    // Enviarlo al id de la orden
    router.replace(`/orders/${message}`);
  };

  /*if (!shippingAddress) {
    <></>;
  }*/

  //const { firstName, lastName, address, address2, phone, zip, country, city } = (shippingAddress);

  //console.log(shippingAddress);

  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden de compra'>
      <Typography variant='h1' component='h1'>
        Resumen de la orden
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({numberOfItems} {numberOfItems === 1 ? 'Producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                <Link underline='always' href='/checkout/address'>
                  Editar
                </Link>
              </Box>

              <Typography>
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </Typography>
              <Typography>
                {shippingAddress?.address} {shippingAddress?.address2 ? `, ${shippingAddress.address2}` : ''}
              </Typography>
              <Typography>
                {shippingAddress?.city}, {shippingAddress?.zip}
              </Typography>
              <Typography>{countries.find((c) => c.code === shippingAddress?.country)?.name}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <Link underline='always' href='/cart'>
                  Editar
                </Link>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button
                  color='secondary'
                  className='circular-btn'
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip
                  color='error'
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryOrder;
