import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas protegidas (adicione outras conforme necessário)
const protectedRoutes = ["/dashboard", "/invoices"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se a rota atual é protegida
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verifica se o cookie de sessão existe
  const sessionCookie = request.cookies.get("authjs.session-token");

  if (!sessionCookie) {
    // Redireciona para login se não autenticado
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário autenticado, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*"],
};
