import type { ListResponseModel } from "../models/listResponseModel";
import type { Neighborhood } from "../models/neigborhoodModel";
import type { RawMaterial } from "../models/rawMaterialModel";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const neighborhoodService = createApi({
  reducerPath: "neighborhoodService",
  baseQuery: baseQuery,
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
    updateNeighborhood: builder.mutation<void, Neighborhood>({
      query: (neighborhood) => ({
        url: `/Neighborhood`,
        method: "PUT",
        body: neighborhood,
      }),
      invalidatesTags: ["Neighborhood"],
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
  useUpdateNeighborhoodMutation,
  useDeleteNeighborhoodMutation,
} = neighborhoodService;
