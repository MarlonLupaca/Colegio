import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Si el usuario no tiene token e intenta entrar a un portal, redirigir al login
  if (!token && pathname.startsWith('/portal')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si el usuario ya está autenticado e intenta ir al login, redirigir a su portal
  if (token && pathname === '/login') {
    // Nota: Por defecto al dashboard de estudiante, o puedes descodificar el rol del JWT
    return NextResponse.redirect(new URL('/portal/student', request.url));
  }

  return NextResponse.next();
}

// Proteger todas las rutas bajo /portal
export const config = {
  matcher: ['/portal/:path*', '/login'],
};
