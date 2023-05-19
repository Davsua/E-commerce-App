import { useSession, signOut } from 'next-auth/react';

import { tesloApi } from '<@davsua>/api';
import { IUser } from '<@davsua>/interfaces';
import Cookies from 'js-cookie';
import { useEffect, useReducer } from 'react';

import { AuthContext, authReducer } from './';
import axios from 'axios';
import { useRouter } from 'next/router';
//definir estado de la aplicacion

type Props = {
  children?: React.ReactNode;
};

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  //obtener los datos del usuario (logeado con otra red social)
  const session = useSession();
  //console.log({ session });

  useEffect(() => {
    if (session.status === 'authenticated') {
      //console.log(session.data.user);
      dispatch({ type: 'Auth - login', payload: session.data?.user as IUser });
    }
  }, [session.status, session.data]);

  /** ESTO SE USA CUANDO ES AUTENTICACION PERSONALIZADA, NO NEXTAUTH */

  // useEffect(() => {
  //   checkToken();
  // }, []);

  // validar token
  const checkToken = async () => {
    if (!Cookies.get('token')) return;

    try {
      const { data } = await tesloApi.get(`/user/validate-token`);
      const { user, token } = data;
      // guardar en cookies el nuevo token
      Cookies.set('token', token);

      dispatch({ type: 'Auth - login', payload: user });
    } catch (error) {
      //Eliminar el token si hay algun error
      Cookies.remove('token');
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post(`/user/login`, { email, password });
      const { token, user } = data;

      Cookies.set('token', token); // guardar en cookies el token

      dispatch({ type: 'Auth - login', payload: user });

      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post(`/user/register`, { name, email, password });
      const { token, user } = data;

      Cookies.set('token', token);

      dispatch({ type: 'Auth - login', payload: user });

      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true, //propiedad de axios
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true, //propiedad de axios
        message: 'No se pudo crear el usuario, intentalo de nuevo',
      };
    }
  };

  const logout = () => {
    //Limpiar las cookies

    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('laslastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');

    // deasde nextJS facilitan esto.
    signOut();

    // hacer un "refresh en la pagina"
    // como ya no tiene cookies, seria como reiniciar la app

    // --> ya no son necesarion, solo se usan en la auth personalizada

    ///router.reload();
    ///Cookies.remove('token');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        //methods

        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
