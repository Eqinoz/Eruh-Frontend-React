import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { StockMovementDto } from "../models/stockMovementDtoModel";
import type { ListResponseModel } from "../models/listResponseModel";

//const BASEURL = "https://localhost:44381/api/";
const BASEURL = "https://eruh.runasp.net/api/";

export const stockMovementService = createApi({
    reducerPath: "stockMovementApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASEURL,
    }),
    endpoints: (builder) => ({
        getStockMovements: builder.query<ListResponseModel<StockMovementDto>, void>({
            query: () => "StockMovement/details",
        }),
    }),
});

export const { useGetStockMovementsQuery } = stockMovementService;
