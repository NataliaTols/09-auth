// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const publicRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes'];

const BASE_URL = 'https://notehub-api.goit.study';

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const pathname = new URL(request.url).pathname;
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  try {
    // Check session by calling the API
    const sessionResponse = await axios.get(`${BASE_URL}/auth/session`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const isAuthenticated = sessionResponse.status === 200;

    if (isPublicRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (isPrivateRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If session check fails, treat as not authenticated
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

