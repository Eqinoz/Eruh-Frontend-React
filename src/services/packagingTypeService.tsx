import { createApi } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { PackagingTypeModel } from "../models/packagingTypeModel";
import { baseQuery } from "./baseQuery";

export const packagingTypeService = createApi({
    reducerPath: "packagingTypeApi",
    baseQuery: baseQuery,
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
