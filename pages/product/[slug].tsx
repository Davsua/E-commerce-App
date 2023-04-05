import { useState, useContext } from 'react';

import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps, GetStaticProps, GetStaticPaths } from 'next';

import { getAllProductsSlug } from '../../database/dbProducts';
import { ItemCounter } from '<@davsua>/components/cart';
import { ShopLayout } from '<@davsua>/components/layouts';
import { ProductSlideShow, SizeSelector } from '<@davsua>/components/products';
import { dbProducts } from '<@davsua>/database';
import { ICartProduct, Iproduct, ISize } from '<@davsua>/interfaces';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { CartContext } from '../../context';

interface Props {
  product: Iproduct;
}

// NextPage es un functional component en Next === React.FC
const ProductsPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  /** 1. forma de traer los productos 
  // const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`);
  // console.log({ product });
  **/

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }));
  };

  const onAddProduct = () => {
    //si no se ha elegido talla, no se agrega
    if (!tempCartProduct.size) return;

    // llamar dispatch de context para agg el pdcto al carrito
    addProductToCart(tempCartProduct);

    //router.push('/cart');
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* --> Titulo <-- */}
            <Typography variant='h1' component='h1'>
              {product.title}
            </Typography>
            <Typography variant='subtitle1' component='h2'>
              {'$' + product.price}
            </Typography>
          </Box>

          {/* --> Cantidad <-- */}
          <Box sx={{ my: 2 }}>
            <Typography variant='subtitle2'>Cantidad</Typography>

            <ItemCounter
              currentValue={tempCartProduct.quantity}
              updatedQuantity={onUpdateQuantity}
              maxValue={product.inStock > 5 ? 5 : product.inStock}
            />
            <SizeSelector
              selectedSize={tempCartProduct.size}
              sizes={product?.sizes}
              onSelectedSize={selectedSize}
            />

            {/* agregar al carro */}
            {product.inStock > 0 ? (
              <Button
                color='secondary'
                className='circular-btn'
                sx={{ width: '100%', mt: 2 }}
                onClick={onAddProduct}
              >
                {tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla'}
              </Button>
            ) : (
              <Chip
                label='No hay disponbles'
                color='error'
                variant='outlined'
                sx={{ width: '100%', mt: 2 }}
              />
            )}

            {/* CHIP : Similar a un botton, mas como una advertencia*/}
            {/**/}
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant='subtitle2'>Descripcion</Typography>
            <Typography variant='body2'>{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// ---------------------------------------------------------------//

// 1. first way to do it ... server side prop -> loading the product that i search

//----------------------------------------------------------------//

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// --> get the slug from link (params)
//   const { slug = '' } = ctx.params as { slug: string };

// --> use the function to find exactly slug in DB
//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

// ---------------------------------------------------------------//

// 2. second way to do it ... static loading -> loading all the products making available pre fetching

//----------------------------------------------------------------//

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  // get all slugs from DB
  const productSlugs = await dbProducts.getAllProductsSlug();

  return {
    // desctructuring slug from productsSlugs to get the string
    paths: productSlugs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async (ctx) => {
  // obtain slug from url (params)
  const { slug = '' } = ctx.params as { slug: string };
  // find exactly slug from DB
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 86400, // revalidate every 24 hours
  };
};

export default ProductsPage;
