import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserModel } from "../models/userModel";
import type { ListResponseModel } from "../models/listResponseModel"; // Senin genel list modelin

// Base URL ayarı
const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44381/api";

export const userService = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    // Token göndermeyi unutmayalım (Authorize için)
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // Kullanıcıları Listele
    getUsers: builder.query<ListResponseModel<UserModel>, void>({
      query: () => "/Users/details", // Senin verdiğin adres
      providesTags: ["Users"],
    }),
    
    // (İleride lazım olursa) Kullanıcı Sil
    // deleteUser: builder.mutation<void, number>({ ... }) 
  }),
});

export const { useGetUsersQuery } = userService;