import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export type TokenClaims = {
  sub: string;
  name: string;
  email: string;
  picture: string;
  exp: number;
};

export const refreshToken = async (): Promise<string> => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
        withCredentials: true,
      },
    )
    .then((res) => res.data['access_token']);
};

export const decodeToken = (token: string): TokenClaims => {
  try {
    const claims = jwtDecode<TokenClaims>(token);
    if (!claims.sub || !claims.name || !claims.email || !claims.picture || !claims.exp) {
      throw new Error('Invalid token claims');
    }
    return claims;
  } catch (error) {
    throw new Error(`Failed to decode token | token: ${token} | ${error}`);
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const storeToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const clearToken = () => {
  localStorage.removeItem('accessToken');
};
