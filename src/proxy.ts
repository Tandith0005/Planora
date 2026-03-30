import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const protectedRoutes = ['/dashboard', '/notifications']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/dashboard/:path*', '/notifications/:path*'],
}
