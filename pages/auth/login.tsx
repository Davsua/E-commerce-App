import React, { useState, useContext, useEffect } from 'react';

import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { GetServerSideProps } from 'next';

import { useForm } from 'react-hook-form';

import { ErrorOutline } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from '@mui/material';
//import { Chip } from '@mui/material';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';

import { AuthLayout } from '<@davsua>/components/layouts';
import { validations } from '<@davsua>/utils';
//import { tesloApi } from '<@davsua>/api';
//import { AuthContext } from '<@davsua>/context';

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
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    //getproviders es una promesa que traera mis providers (credenciales, github...)

    getProviders().then((prov) => {
      //console.log({ prov });
      setProviders(prov);
    });
  }, []);

  //const { loginUser } = useContext(AuthContext);

  const onLoginUser = async ({ email, password }: FormData) => {
    // data contiene el email y password... se destructuraron en la funcion
    //console.log({ data });

    setShowError(false);

    //const isValidLogin = await loginUser(email, password);

    setShowError(false);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   //ocultarolo despues de determinado tiempo (opcional)
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // // tomar por el query parametro que se le esta enviando para volver a la pagina
    // // en la que estaba el usuario al oprimir el boton de ingresar
    // // query parametro esta en SideMenu
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    //! -> toma los provider permitidos ([...nextauth]), data
    await signIn('credentials', { email, password });
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
              {/*<Chip
                label='No se reconoce ese usuario / contraseña'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
      />*/}
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

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') return <div key='credenmtials'></div>;

                return (
                  <Button
                    key={provider.id}
                    variant='outlined'
                    fullWidth
                    color='primary'
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  // crear la sesion con los datos proporcionados
  const session = await getSession({ req });
  //console.log(session);

  // redirigir a la pantalla que estaba antes o al inicio
  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
