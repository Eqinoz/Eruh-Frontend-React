import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { ListResponseModel } from "../models/listResponseModel";
import type { Neighborhood } from "../models/neigborhoodModel";
import type { RawMaterial } from "../models/rawMaterialModel";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
//const BASE_URL = "https://eruh.runasp.net/api";

export const neighborhoodService = createApi({
  reducerPath: "neighborhoodService",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Neighborhood", "RawMaterial"],
  endpoints: (builder) => ({
    getNeighborhoods: builder.query<ListResponseModel<Neighborhood>, void>({
      query: () => "/neighborhood/",
      providesTags: ["Neighborhood"],
    }),
    addNeighborhood: builder.mutation<void, Neighborhood>({
      query: (neighborhood) => ({
        url: "/neighborhood",
        method: "POST",
        body: neighborhood,
      }),
      invalidatesTags: ["Neighborhood", "RawMaterial"],
    }),
    addToNeighborhood: builder.mutation<void, RawMaterial>({
      query: (rawMaterial) => ({
        url: "/neighborhood/",
        method: "POST",
        body: rawMaterial,
      }),
      invalidatesTags: ["Neighborhood", "RawMaterial"],
    }),
    deleteNeighborhood: builder.mutation<void, number>({
      query: (id) => ({
        url: `/neighborhood/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Neighborhood"],
    }),
  }),
});
export const {
  useGetNeighborhoodsQuery,
  useAddNeighborhoodMutation,
  useAddToNeighborhoodMutation,
  useDeleteNeighborhoodMutation,
} = neighborhoodService;
