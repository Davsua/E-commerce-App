import { useContext } from 'react';

import { UiContext } from '<@davsua>/context';
import { AppBar, Toolbar, Link, Typography, Box, Button } from '@mui/material';

export const AdminNavBar = () => {
  const { toggleSideMenu } = useContext(UiContext);

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

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
