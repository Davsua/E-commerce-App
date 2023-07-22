import React from 'react';
import { SideMenu } from '../ui';
import { AdminNavBar } from '../admin';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({ title, subTitle, icon, children }) => {
  return (
    <>
      <nav>
        <AdminNavBar />
      </nav>

      <SideMenu />

      <main style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px' }}>
        <Box display='flex' flexDirection='column'>
          <Typography variant='h1' component='h1'>
            {icon} {title}
          </Typography>
        </Box>

        <Typography variant='h2' sx={{ mb: 1 }}>
          {subTitle}
        </Typography>

        <Box className='fadeIn'>{children}</Box>
      </main>

      <footer></footer>
    </>
  );
};
