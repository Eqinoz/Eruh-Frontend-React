import { createApi } from "@reduxjs/toolkit/query/react";
import type { LoginModel } from "../models/loginModul";
import type { TokenResponse } from "../models/tokenModel";
import { baseQuery } from "./baseQuery";



export const authService = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginModel>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authService;
