import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { clearToken, decodeToken, getToken, refreshToken } from './auth';
import { redirect } from './navigation';

const api: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  const claims = decodeToken(token);
  const isExpired = claims.exp < Date.now() / 1000;
  if (isExpired) {
    token = await refreshToken();
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearToken();
      redirect('/');
    }

    if (error.response) {
      return Promise.reject(
        `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data, null, 2)}`,
      );
    }

    return Promise.reject(error);
  },
);

export default api;

export const fetcherGet = (url: string) => api.get(url).then((res) => res.data);
