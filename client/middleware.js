import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_ROUTES = ["/home"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get("refreshToken");

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );


  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  
  if (!refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
