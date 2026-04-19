'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader/Loader';

type Props = {
  children: React.ReactNode;
};

const privateRoutes = ['/profile', '/notes'];

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const sessionValid = await checkSession();
        if (sessionValid) {
          const user = await getMe();
          if (user) {
            setUser(user);
          }
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [setUser, clearIsAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    const isPrivateRoute = privateRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPrivateRoute && !isAuthenticated) {
      const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          clearIsAuthenticated();
          router.push('/sign-in');
        }
      };

      handleLogout();
    }
  }, [isLoading, isAuthenticated, pathname, clearIsAuthenticated, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return children;
};

export default AuthProvider;