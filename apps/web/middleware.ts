import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude login page from protection
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }
  
  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Redirect /admin to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
