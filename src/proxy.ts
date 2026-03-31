import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/notifications", "/admin"];

function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // const isProtected = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // if (!isProtected) return NextResponse.next();

  // const token = request.cookies.get("accessToken")?.value;

  // if (!token) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // const role = getRoleFromToken(token);

  // Non-admin trying to access /admin
  // if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Admin trying to access /dashboard — send to admin panel
  

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/admin-dashboard/:path*", "/notifications/:path*"],
  matcher: [],
};