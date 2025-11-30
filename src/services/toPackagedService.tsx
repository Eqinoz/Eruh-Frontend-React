import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ToPackagedItem } from "../models/toPackagedModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
//const BASE_URL = "https://eruh.runasp.net/api";

export const toPackagedService = createApi({
  reducerPath: "toPackagedService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

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
  useDeleteToPackagedItemMutation,
} = toPackagedService;
