import { createApi } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ToPackagedItem } from "../models/toPackagedModal";
import { baseQuery } from "./baseQuery";


export const toPackagedService = createApi({
  reducerPath: "toPackagedService",
  baseQuery: baseQuery,
  tagTypes: ["ToPackaged"],
  endpoints: (builder) => ({
    getToPackagedItems: builder.query<ListResponseModel<ToPackagedItem>, void>({
      query: () => ({
        url: "/topackaged/",
        method: "GET",
      }),
      providesTags: ["ToPackaged"],
    }),

    addToPackagedItem: builder.mutation<void, ToPackagedItem>({
      query: (item) => ({
        url: "/topackaged",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["ToPackaged"],
    }),
    updateToPackagedItem: builder.mutation<void, ToPackagedItem>({
      query: (item) => ({
        url: `/topackaged`,
        method: "PUT",
        body: item,
      }),
      invalidatesTags: ["ToPackaged"],
    }),
    deleteToPackagedItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/topackaged/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ToPackaged"],
    }),
  }),
});
export const {
  useGetToPackagedItemsQuery,
  useAddToPackagedItemMutation,
  useUpdateToPackagedItemMutation,
  useDeleteToPackagedItemMutation,
} = toPackagedService;
