import { initialData } from '<@davsua>/database/seed-data';
import { Grid, Link, Typography, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { ItemCounter } from './ItemCounter';
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { Product } from '<@davsua>/models';
import { Iproduct } from '../../interfaces/products';
import { ICartProduct, ICartProductItem, IOrderItem } from '<@davsua>/interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: React.FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  //console.log(cart);

  // const [tempCartProduct, setTempCartProduct] = useState<ICartProductItem>({
  //   _id: product._id,
  //   quantity: 1,
  // });

  // const onUpdateQuantity = (quantity: number) => {
  //   setTempCartProduct((currentProduct) => ({
  //     ...currentProduct,
  //     quantity,
  //   }));
  // };

  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid container spacing={2} sx={{ mb: 1 }} key={product._id + product.size}>
          <Grid item xs={3}>
            <Link href={`product/${product.slug}`}>
              <CardActionArea>
                <CardMedia image={product.image} component='img' sx={{ borderRadius: '5px' }} />
              </CardActionArea>
            </Link>
          </Grid>

          {/* Grid de info */}
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Talla: <strong>{product.size}</strong>{' '}
              </Typography>

              {/* --> Si es o no editable <-- */}
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={5}
                  // (este viene de itemCounter -> AddOrRemove) => funcion que se crea aqui
                  updatedQuantity={(newValue) => onNewCartQuantityValue(product as ICartProduct, newValue)}
                />
              ) : (
                <Typography variant='h5'>
                  {product.quantity} {product.quantity > 1 ? 'Productos' : 'Producto'}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Grid precio */}
          <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
            <Typography>{'$' + product.price}</Typography>
            {editable && (
              <Button
                variant='text'
                color='secondary'
                onClick={() => removeCartProduct(product as ICartProduct)}
              >
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
