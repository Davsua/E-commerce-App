import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';

import { Box, Grid, TextField, Button, Link, Chip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '<@davsua>/components/layouts';
import { tesloApi } from '<@davsua>/api';
import { validations } from '<@davsua>/utils';
import { useRouter } from 'next/router';
import { AuthContext } from '<@davsua>/context';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  //console.log(errors);

  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onshowError = async ({ name, email, password }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
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
    <AuthLayout title='Registro'>
      <form
        onSubmit={handleSubmit(onshowError)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(onshowError);
            e.preventDefault();
          }
        }}
        noValidate
      >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Crear cuenta
              </Typography>
              <Chip
                label='Esta cuenta ya esta registrada'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Full Name'
                variant='filled'
                fullWidth
                {...register('name', {
                  //validaciones..
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Minimo 2 caracteres' },
                })}
                // ---> !! = conversion de un obj a boolean <----
                error={!!errors.name}
                // --> message = required anterior
                helperText={errors.name?.message}
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
                Registrarte
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <Link
                href={router.query.p ? `/auth/login?p=${router.query.p?.toString()}` : '/auth/login'}
                underline='always'
              >
                ¿Ya tienes cuenta?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
