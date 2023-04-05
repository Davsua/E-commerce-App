import { Iproduct } from '<@davsua>/interfaces';
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material';
import React, { useMemo, useState } from 'react';

interface Props {
  product: Iproduct;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  // crear efecto al poner mouse sobre imagen
  const [isHovered, setIsHovered] = useState(false);
  //forza a que las letras esperen que la imagen se cargue para aparecer con ella
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? `/products/${product.images[1]}` : `/products/${product.images[0]}`;
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1 Forma para el efecto*/}
      {/**
       * <Card>
            <CardActionArea>
              {isHovered ? (
                <CardMedia
                  component='img'
                  className='fadeIn'
                  image={`products/${product.images[1]}`}
                  alt={product.title}
                />
              ) : (
                <CardMedia
                  component='img'
                  className='fadeIn'
                  image={`products/${product.images[0]}`}
                  alt={product.title}
                />
              )}
            </CardActionArea>
              </Card>
          **/}

      {/* 2da forma -> UseMemo :*/}
      <Card>
        <Link href={`/product/${product.slug}`}>
          <CardActionArea>
            {product.inStock === 0 && (
              <Chip
                color='primary'
                label='no hay disponibles'
                sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
              />
            )}

            <CardMedia
              component='img'
              className='fadeIn'
              image={productImage}
              alt={product.title}
              onLoad={() => setIsImageLoaded(true)}
            />
          </CardActionArea>
        </Link>
      </Card>

      <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{'$' + product.price}</Typography>
      </Box>
    </Grid>
  );
};
