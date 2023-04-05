import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

export const FullScreenLoading = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignContent='center'
      height='calc(100vh - 200px)'
    >
      <Typography sx={{ mb: 3, marginRight: 'auto', marginLeft: 'auto' }}>Cargando...</Typography>
      <CircularProgress sx={{ marginRight: 'auto', marginLeft: 'auto' }} thickness={2} />
    </Box>
  );
};
