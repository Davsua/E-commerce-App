import React, { useState, useContext } from 'react';

import { useForm } from 'react-hook-form';

import { ErrorOutline } from '@mui/icons-material';
import { Box, Grid, TextField, Button, Link, Chip } from '@mui/material';
import Typography from '@mui/material/Typography';

import { AuthLayout } from '<@davsua>/components/layouts';
import { validations } from '<@davsua>/utils';
import { tesloApi } from '<@davsua>/api';
import { AuthContext } from '<@davsua>/context';
import { useRouter } from 'next/router';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  //console.log(errors);

  const router = useRouter();
  //console.log(router.query);
  const [showError, setShowError] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const onLoginUser = async ({ email, password }: FormData) => {
    // data contiene el email y password... se destructuraron en la funcion
    //console.log({ data });

    setShowError(false);

    const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      //ocultarolo despues de determinado tiempo (opcional)
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    // tomar por el query parametro que se le esta enviando para volver a la pagina
    // en la que estaba el usuario al oprimir el boton de ingresar
    // query parametro esta en SideMenu
    const destination = router.query.p?.toString() || '/';
    router.replace(destination);
  };

  return (
    <AuthLayout title='Ingresar'>
      {/* no validate evita que chrome lanze error por no poner @*/}
      <form
        onSubmit={handleSubmit(onLoginUser)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(onLoginUser);
            e.preventDefault();
          }
        }}
        noValidate
      >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Iniciar sesión
              </Typography>
              <Chip
                label='No se reconoce ese usuario / contraseña'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='correo'
                variant='filled'
                fullWidth
                {...register('email', {
                  //validaciones..
                  required: 'Este campo es requerido',
                  //(value) => validations.isEmail(value) -> es lo mismo que...
                  validate: validations.isEmail,
                })}
                // ---> !! = conversion de un obj a boolean <----
                error={!!errors.email}
                // --> message = required anterior
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='contraseña'
                type='password'
                variant='filled'
                fullWidth
                {...register('password', {
                  required: 'Esta campo es requerido',
                  minLength: { value: 6, message: 'Minimo 6 caracteres' },
                })}
                error={!!errors.password}
                // --> message = required anterior
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color='secondary' className='circular-btn' size='large' type='submit'>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <Link
                href={router.query.p ? `/auth/register?p=${router.query.p?.toString()}` : '/auth/register'}
                underline='always'
              >
                ¿No tienes cuenta?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
