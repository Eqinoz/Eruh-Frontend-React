import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { PackagingTypeModel } from "../models/packagingTypeModel";

const BASE_URL = import.meta.env.VITE_API_URL || "https://eruh.runasp.net/api";

export const packagingTypeService = createApi({
    reducerPath: "packagingTypeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["PackagingType"],
    endpoints: (builder) => ({
        getPackagingTypes: builder.query<ListResponseModel<PackagingTypeModel>, void>({
            query: () => "/PackagingType",
            providesTags: ["PackagingType"],
        }),
        addPackagingType: builder.mutation<any, Omit<PackagingTypeModel, "id">>({
            query: (body) => ({
                url: "/PackagingType",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PackagingType"],
        }),
        updatePackagingType: builder.mutation<any, PackagingTypeModel>({
            query: (body) => ({
                url: "/PackagingType",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["PackagingType"],
        }),
        deletePackagingType: builder.mutation<any, number>({
            query: (id) => ({
                url: `/PackagingType/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PackagingType"],
        }),
    }),
});

export const {
    useGetPackagingTypesQuery,
    useAddPackagingTypeMutation,
    useUpdatePackagingTypeMutation,
    useDeletePackagingTypeMutation,
} = packagingTypeService;
