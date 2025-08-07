/* eslint-disable no-console */
import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  clearToken,
  decodeToken,
  getToken,
  refreshToken,
  storeToken,
  TokenClaims,
} from '@/lib/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  claims: TokenClaims;
  loading: boolean;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<TokenClaims>({} as TokenClaims);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setClaims({} as TokenClaims);
    setLoading(false);
    if (router.pathname !== '/') {
      router.push('/');
    }
  }, [router]);
  const login = useCallback(
    (token: string, claims: TokenClaims) => {
      storeToken(token);
      setToken(token);
      setClaims(claims);
      setLoading(false);
      if (router.pathname === '/') {
        router.push('/app');
      }
    },
    [router],
  );

  useEffect(() => {
    const token = getToken();
    if (!token) {
      logout();
      return;
    }

    try {
      const claims = decodeToken(token);

      const isExpired = claims.exp < Date.now() / 1000;
      if (isExpired) {
        refreshToken()
          .then((newToken) => login(newToken, decodeToken(newToken)))
          .catch((error) => {
            console.error(error);
            logout();
          });
        return;
      }

      login(token, claims);
    } catch (error) {
      console.error(error);
      logout();
    }
  }, [login, logout, router]);

  useEffect(() => {
    if (router.query.access_token) {
      const token = router.query.access_token as string;
      try {
        const claims = decodeToken(token);
        login(token, claims);
      } catch (error) {
        console.error(error);
        logout();
      }
    }
  }, [login, logout, router, router.query.access_token]);

  const value: AuthContextType = {
    isAuthenticated: !!token,
    token,
    claims,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
