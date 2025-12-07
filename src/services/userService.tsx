import { createApi } from "@reduxjs/toolkit/query/react";
import type { UserModel } from "../models/userModel";
import type { ListResponseModel } from "../models/listResponseModel"; // Senin genel list modelin
import { baseQuery } from "./baseQuery";


export const userService = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
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