import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { clearCredentials } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // важливо для cookie-based JWT
});

// Якщо сесія закінчилась (cookie протермінований або пароль змінено),
// сервер повертає 401 — прибираємо застарілі дані користувача з localStorage
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && api.getState().auth.userInfo) {
    api.dispatch(clearCredentials());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
