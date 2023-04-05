import { GetServerSideProps, NextPage } from 'next';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Card, CardActionArea, CardMedia, Box } from '@mui/material';
import { ProductList } from '<@davsua>/components/products';

import { dbProducts } from '<@davsua>/database';
import { Iproduct } from '<@davsua>/interfaces';

interface Props {
  products: Iproduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={'Teslo shop - search'}
      pageDescription={'Encuentra variedad y calidad en Teslo shop'}
    >
      <Typography variant='h1' component='h1'>
        Buscar producto
      </Typography>

      {foundProducts ? (
        <Typography variant='h2' sx={{ marginBottom: 1 }} textTransform='capitalize'>
          {query}
        </Typography>
      ) : (
        <Box display='flex'>
          <Typography variant='h2' sx={{ marginBottom: 1 }}>
            No se encontro ningun producto
          </Typography>
          <Typography
            variant='h2'
            sx={{ marginLeft: 1 }}
            color='secondary'
            textTransform='capitalize'
          >
            {'"' + query + '"'}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query = '' } = ctx.params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);

  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
    // o se podria colocar un query que busque articulos similares :
    //products = await dbProducts.getProductsByTerm("something");
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
