import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ContractorModel } from "../models/contractorModel";

//const BASE_URL = "https://localhost:44381/api";
const BASE_URL = "https://eruh.runasp.net/api";

export const contractorService = createApi({
    reducerPath:"contractorService",
    baseQuery:fetchBaseQuery({baseUrl:BASE_URL}),
    tagTypes:["Contractor"],
    endpoints:(builder)=>({
        getContractors:builder.query<ListResponseModel<ContractorModel>,void>({
            query:()=>"/Contractor",
            providesTags:["Contractor"]
        }),
        addContractor:builder.mutation<any,ContractorModel>({
            query:(contractor)=>({
                url:"/Contractor",
                method:"POST",
                body:contractor
            }),
            invalidatesTags:["Contractor"]
        }),
        updateContractor:builder.mutation<any,ContractorModel>({
            query:(contractor)=>({
                url:"/Contractor",
                method:"PUT",
                body:contractor
            }),
            invalidatesTags:["Contractor"]
        }),
        deleteContractor:builder.mutation<any,number>({
            query:(id)=>({
                url:`/Contractor/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:["Contractor"]
        })
    })
    
})
export const {useGetContractorsQuery,
    useAddContractorMutation,
    useUpdateContractorMutation,
    useDeleteContractorMutation} = contractorService