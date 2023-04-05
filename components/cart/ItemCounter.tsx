import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
  currentValue: number;
  maxValue: number;

  updatedQuantity: (value: number) => void;
}

export const ItemCounter: React.FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {
  const addOrRemove = (value: number) => {
    // resta
    if (value === -1) {
      // no disminuir a 0
      if (currentValue === 1) return;

      return updatedQuantity(currentValue - 1);
    }

    // no hacer nada si el current value es mayor que el limite
    if (currentValue >= maxValue) return;

    // sumar
    updatedQuantity(currentValue + 1);
  };

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
