import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductList } from '<@davsua>/components/products';
import { Product } from '<@davsua>/models';
import { useProducts } from '<@davsua>/hooks';
import { FullScreenLoading } from '../../components/ui';

export default function KidPage() {
  const { products, isLoading } = useProducts('/products?gender=kid');

  //console.log(products);

  return (
    <ShopLayout
      title={'Teslo shop - Kids'}
      pageDescription={'venta de articulos para niños y niñas'}
    >
      <Typography variant='h1' component='h1'>
        Niños
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>
        Productos para niños
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
