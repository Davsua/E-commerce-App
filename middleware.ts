import { NextResponse, type NextRequest } from 'next/server';

import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  //console.log(req);
  const previousPage = req.nextUrl.pathname;

  if (previousPage.startsWith('/checkout')) {
    const token = req.cookies.get('token')?.value || '';

    try {
      //verificar token, si es valido, continuar
      await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
      return NextResponse.next();
    } catch (error) {
      //si hay un error redireccionar a la pagina de login, guardando ('/checkout/address')
      return NextResponse.redirect(new URL(`/auth/login?p=${previousPage}`, req.url));
    }
  }
}

export const config = {
  matcher: ['/checkout/:path*'],
};
