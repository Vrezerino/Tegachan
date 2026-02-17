import { NextResponse, NextRequest } from 'next/server';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, isErrorWithStatusCodeType } from './app/lib/utils';

const middleware = async (req: NextRequest) => {
  /**
   * The server will only allow GET and POST requests. It must return an
   * "Allow" header field to the 405 status code response, to inform the client
   * what methods are allowed.
   */
  if (!('GET, POST'.includes(req.method))) {
    const response = NextResponse.json({ error: 'Method not allowed!', status: 405 });
    response.headers.set('Allow', 'GET, POST');
    return response;
  }

  if (req.method === 'POST') {
    try {
      // FormData is a promise; resolve it before getting image field
      const file = (await req.formData()).get('image') as File;

      // Some validations before the request even hits the server
      if (file && file.size > 0) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          throw { message: 'GIF/JPG/PNG/WEBP/AVIF only.', status: 400 };
        }

        if (file && file.size >= MAX_FILE_SIZE) {
          throw { message: `Image must be under ${MAX_FILE_SIZE / 1000000} MB in size.`, status: 400 };
        }
      }

      return NextResponse.rewrite(new URL('/api/posts', req.url));

    } catch (e: unknown) {
      return NextResponse.json(
        { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : '' },
        { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
      );
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - img (images in /public folder)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!img/|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default middleware;