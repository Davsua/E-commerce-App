import { ShopLayout } from '../components/layouts/ShopLayout';
import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductList } from '<@davsua>/components/products';
import { Product } from '<@davsua>/models';
import { useProducts } from '<@davsua>/hooks';
import { FullScreenLoading } from '../components/ui';

export default function Home() {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout
      title={'Teslo shop - home'}
      pageDescription={'Encuentra variedad y calidad en Teslo shop'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
