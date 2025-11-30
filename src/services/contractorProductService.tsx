import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ContractorProductModel } from "../models/contractorProductModel";
import type { ContractorProductDtoModel } from "../models/contractorProductDtoModel";

//const BASE_URL = "https://localhost:44381/api";
const BASE_URL = "https://eruh.runasp.net/api";

export const contractorProductService=createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes:["ContractorProducts"],
    endpoints: (builder) => ({
        getContractorProducts: builder.query<ListResponseModel<ContractorProductModel>, void>({
            query: () => "/ContractorProduct/getall",
            providesTags: ["ContractorProducts"],
        }),
        getContractorDetail: builder.query<ListResponseModel<ContractorProductDtoModel>,void>({
            query: () => "/ContractorProduct/getdetails",
            providesTags: ["ContractorProducts"],
        }),
        getContractorProductById: builder.query<ContractorProductModel,number>({
            query: (id) => `/ContractorProduct/${id}`,
            providesTags: ["ContractorProducts"],
        }),
        getContractorProductDetailById: builder.query<ListResponseModel<ContractorProductDtoModel>,number>({
            query: (id) => `/ContractorProduct/getdetails/${id}`,
            providesTags: ["ContractorProducts"],
        }),
        addContractorProduct: builder.mutation<ContractorProductModel, ContractorProductModel>({
            query: (model) => ({
                url: "/ContractorProduct",
                method: "POST",
                body: model,
            }),
            invalidatesTags: ["ContractorProducts"],
        }),
        updateContractorProduct: builder.mutation<ContractorProductModel, ContractorProductModel>({
            query: (model) => ({
                url: "/ContractorProduct",
                method: "PUT",
                body: model,
            }),
            invalidatesTags: ["ContractorProducts"],
        }),
        deleteContractorProduct: builder.mutation<ContractorProductModel, number>({
            query: (id) => ({
                url: `/ContractorProduct/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContractorProducts"],
        }),
    }),
})
export const {useGetContractorProductsQuery,
    useGetContractorDetailQuery,
    useGetContractorProductByIdQuery,
    useGetContractorProductDetailByIdQuery,
    useAddContractorProductMutation,
    useUpdateContractorProductMutation,
    useDeleteContractorProductMutation} = contractorProductService
