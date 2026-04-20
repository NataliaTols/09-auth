// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const publicRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study';

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const pathname = new URL(request.url).pathname;
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  const response = NextResponse.next();
  let isAuthenticated = false;
  // Check if accessToken exists
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    // Try to refresh session
    try {
      const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
        headers: {
          Cookie: cookieHeader,
        },
      });

      if (refreshResponse.status === 200) {
        // Update cookies with new tokens from set-cookie header
        const setCookieHeader = refreshResponse.headers['set-cookie'];
        if (setCookieHeader) {
          setCookieHeader.forEach((cookie) => {
            response.headers.append('Set-Cookie', cookie);
          });
          isAuthenticated = true;
        }
      }
    } catch (error) {
      // Refresh failed, remain not authenticated
    }
  }

  if (isPublicRoute && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    // Copy set-cookie headers to redirect response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        redirectResponse.headers.append(key, value);
      }
    });
    return redirectResponse;
  }

  if (isPrivateRoute && !isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL('/sign-in', request.url));
    // Copy set-cookie headers to redirect response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        redirectResponse.headers.append(key, value);
      }
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

