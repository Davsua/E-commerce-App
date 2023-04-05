import { ShopLayout } from '<@davsua>/components/layouts';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { margin } from '@mui/system';

const emptyPage = () => {
  return (
    <ShopLayout
      title='Carrito de compras vacio'
      pageDescription='No hay articulos en el carrito de compras'
    >
      <Box
        display='flex'
        justifyContent='center'
        alignContent='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlined
          sx={{
            fontSize: 100,
            margin: { xs: '0 auto', sm: 'auto' },
            marginRight: { xs: '0 auto', sm: '0px' },
          }}
        />
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          sx={{ margin: { xs: '0 auto', sm: 'auto' }, marginLeft: { sm: '16px' } }}
        >
          <Typography>Su carrito esta vacio</Typography>
          <Link href='/' typography='h4' color='secondary'>
            Regresar
          </Link>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default emptyPage;
