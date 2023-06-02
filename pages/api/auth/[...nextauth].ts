import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '<@davsua>/database';

// https://next-auth.js.org/getting-started/typescript
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ------> credenciales (personalizado)
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        //console.log({ credentials });

        //siempre debe retornar algo
        //return { id: '12', name: 'David', email: 'Ds@gmail.com', role: 'admin' };

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),

    // --------> GitHub
    GithubProvider({
      // lo datos se toman creando una nueva autenticacion de app en github -> https://github.com/settings/apps
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here (find it in documentation side bar providers) https://next-auth.js.org/getting-started/typescript
  ],

  // -------> custom pages

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  // ------->  Callbacks

  jwt: {
    //secret: process.env.JWT_SECRET_SEED
  },

  session: {
    maxAge: 2592000, //30d dura la sesion
    strategy: 'jwt',
    updateAge: 86400, // cada dia se actualiza
  },

  callbacks: {
    //crear token
    async jwt({ token, account, user }) {
      //console.log({ token, account, user });
      //--> account: cuenta creada con esos datos (cuando es de redes sociales: type: oauth, creado dctamente: credenciales)
      //--> user: usuario creado

      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAUthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;

          default:
            break;
        }
      }

      return token;
    },

    //crear sesion
    async session({ session, token, user }) {
      //console.log(session, token, user);

      session.accessToken = token.accessToken as any; // evitando el error, explicacion arriba al crear modulo (link)
      session.user = token.user as any;

      return session;
    },
  },
};
export default NextAuth(authOptions);
