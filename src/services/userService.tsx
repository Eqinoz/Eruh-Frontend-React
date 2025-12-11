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
    
    // Kullanıcı Güncelle
    updateUser: builder.mutation<any, UserModel>({
      query: (user) => ({
        url: `/Users`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    // Kullanıcı Sil (query param formatı: /user/?id=id)
    deleteUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/user/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} = userService;