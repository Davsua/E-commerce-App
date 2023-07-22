import { NextResponse, type NextRequest } from 'next/server';

import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';
import { url } from 'inspector';

export async function middleware(req: NextRequest) {
  //console.log(req);
  // const previousPage = req.nextUrl.pathname;

  // if (previousPage.startsWith('/checkout')) {
  //   const token = req.cookies.get('token')?.value || '';

  //   try {
  //     //verificar token, si es valido, continuar
  //     await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
  //     return NextResponse.next();
  //   } catch (error) {
  //     //si hay un error redireccionar a la pagina de login, guardando ('/checkout/address')
  //     return NextResponse.redirect(new URL(`/auth/login?p=${previousPage}`, req.url));
  //   }
  // }

  // -------------------- con next auth -------------------->

  //encontrar la sesion vigente
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //console.log({ session });

  if (!session) {
    const requestedPage = req.nextUrl.pathname;

    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }

    return NextResponse.redirect(new URL(`/auth/login?p=${requestedPage}`, req.url));
  }
  const validRoles = ['admin', 'super-user', 'SEO'];

  // ------------> FRONTED -------------

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // -------------> BACKEND (API) ------------

  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders',
    '/api/orders/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/admin',
  ],
};
