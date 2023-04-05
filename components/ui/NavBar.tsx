import { CartContext, UiContext } from '<@davsua>/context';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Input,
  InputAdornment,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

export const NavBar = () => {
  const { numberOfItems } = useContext(CartContext);
  const { toggleSideMenu } = useContext(UiContext);
  const { asPath } = useRouter();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;

    router.push(`/search/${searchTerm}`);
  };

  //console.log(asPath);

  return (
    <AppBar>
      <Toolbar>
        <Link href='/' display='flex' alignItems='center'>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop |</Typography>
        </Link>

        {/* Utilizo todo el espacio disponible antes de esto*/}
        <Box flex={1} />

        {/* este box manipular las dimensiones para hacerlo responsive
        Tener en cuenta que MUI es mobile first, por eso debo especificar la pantalla que quiero
        o como en este caso.. si pongo sm block, de esa pantalla hacia arriba todas tomaran ese estilo
        
        -- > desaparece si la barra de busqueda esta abierta evitando que se vea feo
        */}
        <Box
          sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
          className='fadeIn'
        >
          <Link href='/category/men'>
            <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
          </Link>
          <Link href='/category/women'>
            <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
          </Link>
          <Link href='/category/kid'>
            <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
          </Link>
        </Box>

        {/* Utilizo todo el espacio disponible antes de esto, asi lo centro con el de arriba*/}
        <Box flex={1} />

        {/* desktop */}

        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className='fadeIn'
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            //al presionar enter..
            onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
            type='text'
            placeholder='Buscar...'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            onClick={() => setIsSearchVisible(true)}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* mobile */}
        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton>

        <Link href='/cart'>
          <IconButton>
            {/* badge = cantidad de articulos en el carritos*/}
            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
