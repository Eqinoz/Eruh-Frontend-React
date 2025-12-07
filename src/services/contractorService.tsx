import { createApi } from "@reduxjs/toolkit/query/react";
import type { ListResponseModel } from "../models/listResponseModel";
import type { ContractorModel } from "../models/contractorModel";
import { baseQuery } from "./baseQuery";

export const contractorService = createApi({
    reducerPath:"contractorService",
    baseQuery:baseQuery,
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