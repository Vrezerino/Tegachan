import { NextResponse, NextRequest } from 'next/server';

const middleware = (request: NextRequest) => {
  /**
   * This regexp returns true and user is redirected to /dashboard if 
   * the URL pathname is i.e.:
   * 
   * - /dashboard/rando (typo in board name/board doesn't exist)
   * - /dashboard/random/<any non-numeric characters>
   * - /abc or /abc/
   * - /dashboard/random////rejt894
   * 
   * It returns false and user is not redirected to /dashboard, when 
   * the pathname is i.e.:
   * 
   * - /dashboard
   * - /dashboard/outdoors
   * - /dashboard/random//// (user will end up in /dashboard/random)
   * - /dashboard/technology/845794
   * 
   * It will not redirect to dashboard in the last example if the 
   * resource isn't found by postnumber, because I want the server 
   * to show a 404 page in that case.
   */
  if (/^(?!\/dashboard(?:\/(?:random|technology|music|outdoors)\/?|\/(?:random|technology|music|outdoors)\/\d+)?$).*$/.test(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - img (images in /public foo)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|img/|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default middleware;