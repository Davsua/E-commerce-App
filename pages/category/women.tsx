import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductList } from '<@davsua>/components/products';
import { Product } from '<@davsua>/models';
import { useProducts } from '<@davsua>/hooks';
import { FullScreenLoading } from '../../components/ui';

export default function WomenPage() {
  const { products, isLoading } = useProducts('/products?gender=women');

  //console.log(products);

  return (
    <ShopLayout title={'Teslo shop - Women'} pageDescription={'venta de articulos para mujer'}>
      <Typography variant='h1' component='h1'>
        Mujeres
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        Productos para ellas
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
