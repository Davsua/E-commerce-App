import React, { useContext } from 'react';
import { GetServerSideProps } from 'next';

import { ShopLayout } from '<@davsua>/components/layouts';
import { countries } from '<@davsua>/utils';
import { useEffect } from 'react';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { CartContext } from '<@davsua>/context';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

// tomar la info guardad en cookies para que cada que el user entre no tenga que
// volver a escribir los datos, sino que esten guardados
// Default value
const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('laslastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  };
};

const AdressPage = () => {
  const { updateAddress } = useContext(CartContext);
  const router = useRouter();

  // tomar el type para el form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  //console.log(countries[0].code);

  const onCheckAddress = (data: FormData) => {
    console.log(data);

    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title='Direccion' pageDescription='Confirmar direccion de destino'>
      <Typography variant='h1' component='h1'>
        Direccion de destino:
      </Typography>

      <form
        onSubmit={handleSubmit(onCheckAddress)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(onCheckAddress);
            e.preventDefault();
          }
        }}
        noValidate
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Nombre'
              variant='filled'
              fullWidth
              {...register('firstName', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.firstName}
              // --> message = required anterior
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Last Name'
              variant='filled'
              fullWidth
              {...register('lastName', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.lastName}
              // --> message = required anterior
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Address'
              variant='filled'
              fullWidth
              {...register('address', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.address}
              // --> message = required anterior
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Address2 (optional)'
              variant='filled'
              fullWidth
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.address2}
              // --> message = required anterior
              helperText={errors.address2?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='ZIP'
              variant='filled'
              fullWidth
              {...register('zip', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.zip}
              // --> message = required anterior
              helperText={errors.zip?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='City'
              variant='filled'
              fullWidth
              {...register('city', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.city}
              // --> message = required anterior
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant='filled'
                label='Country'
                defaultValue={Cookies.get('country') || countries[0].code}
                {...register('country', {
                  //validaciones..
                  required: 'Este campo es requerido',
                })}
                // ---> !! = conversion de un obj a boolean <----
                error={!!errors.city}
              >
                {countries.map((country) => (
                  <MenuItem value={country.code} key={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Phone'
              variant='filled'
              fullWidth
              {...register('phone', {
                //validaciones..
                required: 'Este campo es requerido',
              })}
              // ---> !! = conversion de un obj a boolean <----
              error={!!errors.phone}
              // --> message = required anterior
              helperText={errors.phone?.message}
            />
          </Grid>

          <Box sx={{ mt: 5, width: '100%' }} display='flex' justifyContent='center'>
            <Button
              color='secondary'
              className='circular-btn'
              size='medium'
              type='submit'
              style={{ width: '50%' }}
            >
              Revisar pedido
            </Button>
          </Box>
        </Grid>
      </form>
    </ShopLayout>
  );
};

/**
 * ANTES DE LOS MIDDLEWARE ---> VER
 */

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/* Validacion de token para ingresar a esta pagina */

/*
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;

  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
 */

export default AdressPage;
