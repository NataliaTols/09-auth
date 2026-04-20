import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshSession } from './lib/api/serverApi';

const publicRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const pathname = new URL(request.url).pathname;
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const response = NextResponse.next();

  let isAuthenticated = false;

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  
  if (accessToken) {
    isAuthenticated = true;
  }

  
  else if (refreshToken) {
    try {
      const result = await refreshSession();

      if ('data' in result && result.data.success) {
        isAuthenticated = true;

       if ('headers' in result) {
        const setCookieHeader = result.headers?.['set-cookie'];

        if (setCookieHeader) {
          setCookieHeader.forEach((cookie: string) => {
            response.headers.append('Set-Cookie', cookie);
          });
        }
        }
      }
    } catch {
      // ignore
    }
  }

  
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url), {
      headers: response.headers,
    });
  }


  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url), {
      headers: response.headers,
    });
  }

  
  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};