import { CartList, OrderSummary } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';
import { CartContext } from '<@davsua>/context';
import { Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  //Si el cart esta vacio, enviar a la pagina empty cart

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace('/cart/empty');
    }
  }, [cart.length, isLoaded, router]);

  //evitar que se muestre pagina de cart, mostrara un fragmento blanco mientras
  //se carga el empty cart
  if (!isLoaded || cart.length === 0) {
    return <></>;
  }

  return (
    <ShopLayout title='Carrito de compras' pageDescription='Carrito de compras Teslo'>
      <Typography variant='h1' component='h1'>
        Carrito
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' href='/checkout/address'>
                  CheckOut
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
