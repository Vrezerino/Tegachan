import { NextResponse, NextRequest } from 'next/server';
import { newPostSchema } from './app/lib/newPostSchema';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, isErrorWithStatusCodeType } from './app/lib/utils';
import { ErrorWithStatusCode } from './app/lib/definitions';

const middleware = async (request: NextRequest) => {
  /**
   * The server will only allow GET and POST requests. It must return an
   * "Allow" header field to the 405 status code response, to inform the client
   * what methods are allowed.
   */
  if (!('GET, POST'.includes(request.method))) {
    const response = NextResponse.json({ error: 'Method not allowed!', status: 405 });
    response.headers.set('Allow', 'GET, POST');
  }

  /**
   * This regexp returns true and user is redirected to /dashboard if 
   * the URL pathname is e.g.:
   * 
   * - /dashboard/rando (typo in board name/board doesn't exist)
   * - /dashboard/random/<any non-numeric characters>
   * - /abc or /abc/
   * - /dashboard/random////rejt894
   * 
   * It returns false and user is not redirected to /dashboard, when 
   * the pathname is e.g.:
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

  if (request.method === 'POST') {
    try {
      const formData = await request.formData();

      const newPost = {
        content: formData.get('content'),
        title: formData.get('title'),
        replyTo: parseInt(formData.get('replyTo') as string),
        board: formData.get('board'),
        image: formData.get('image')
      }

      if (!newPost.title) newPost.title = newPost.content;
      const file = (formData.get('image') as File);

      // Some validations before the request even hits the server
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        throw { message: 'File is not of accepted type! JPG/PNG/WEBP only.', status: 400 };
      }

      if (file.size >= MAX_FILE_SIZE) {
        throw { message: 'Image must be under 1MB in size.', status: 400 };
      }

      const { error, value } = newPostSchema.validate(newPost);
      if (error) throw { message: error.message, status: 400 };

      //return NextResponse.json('Post successful!', { status: 200 });

    } catch (e: unknown) {
      return NextResponse.json(
        { message: e instanceof Error || isErrorWithStatusCodeType(e) && e.message },
        { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
      );
    }
  }
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