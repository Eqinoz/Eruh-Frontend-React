import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginModel } from "../models/loginModul";
import type { TokenResponse } from "../models/tokenModel";

//const BASE_URL = "https://localhost:44381/api/";
const BASE_URL = "https://eruh.runasp.net/api/";

export const authService = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginModel>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authService;
