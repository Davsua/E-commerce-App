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
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //console.log({ session });

  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    // armar la url para que redirija a pag de autenticacion, la pagina anterior y el query solicitado
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `p=${requestedPage}`;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/orders'],
};
