import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductList } from '<@davsua>/components/products';
import { Product } from '<@davsua>/models';
import { useProducts } from '<@davsua>/hooks';
import { FullScreenLoading } from '../../components/ui';

export default function MenPage() {
  const { products, isLoading } = useProducts('/products?gender=men');

  //console.log(products);

  return (
    <ShopLayout title={'Teslo shop - Men'} pageDescription={'venta de articulos para hombre'}>
      <Typography variant='h1' component='h1'>
        Hombres
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        Productos para ellos
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
