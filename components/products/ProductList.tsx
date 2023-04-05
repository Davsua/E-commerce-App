import { Iproduct } from '<@davsua>/interfaces';
import { Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductCard } from './ProductCard';

interface Props {
  products: Iproduct[];
}

export const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCard key={product._id + product.slug} product={product} />
      ))}
    </Grid>
  );
};
