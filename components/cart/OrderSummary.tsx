import React from 'react';
import { useContext } from 'react';

import { Grid, Typography } from '@mui/material';

import { CartContext } from '../../context/cart/CartContext';
import { currency } from '<@davsua>/utils';

interface Props {
  totalOrder?: number;
  subtotalOrder?: number;
  taxOrder?: number;
  NumberItemsOrder?: number;
}

export const OrderSummary: React.FC<Props> = ({ totalOrder, subtotalOrder, taxOrder, NumberItemsOrder }) => {
  const { subTotal, numberOfItems, tax, total } = useContext(CartContext);

  let itemsOrder = NumberItemsOrder ? NumberItemsOrder : numberOfItems;
  let orderTotal = totalOrder ? totalOrder : currency.format(total);
  let orderSubtotal = subtotalOrder ? subtotalOrder : currency.format(subTotal);
  let orderTax = taxOrder ? taxOrder : currency.format(tax);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>N° Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {itemsOrder} {itemsOrder > 1 ? 'Productos' : 'Producto'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{orderSubtotal}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 || 15}%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{orderTax}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total: </Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>{orderTotal}</Typography>
      </Grid>
    </Grid>
  );
};
