import { ShopLayout } from '<@davsua>/components/layouts';
import React from 'react';
import { Box, Typography } from '@mui/material';

const Custom404 = () => {
  return (
    <ShopLayout title='Page not found' pageDescription='Nothing to show'>
      <Box
        display='flex'
        justifyContent='center'
        alignContent='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Typography
          variant='h1'
          component='h1'
          fontSize={80}
          fontWeight={200}
          margin='auto'
          //marginRight={0}
          sx={{ margin: { xs: '0 auto', sm: 'auto' }, marginRight: { xs: '0 auto', sm: '0px' } }}
        >
          404 |
        </Typography>
        <Typography sx={{ margin: { xs: '0 auto', sm: 'auto' }, marginLeft: { sm: '16px' } }}>
          No existe esta pagina
        </Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
