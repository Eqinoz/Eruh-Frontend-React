import { createApi } from "@reduxjs/toolkit/query/react";
import type { StockMovementDto } from "../models/stockMovementDtoModel";
import type { ListResponseModel } from "../models/listResponseModel";
import { baseQuery } from "./baseQuery";

    
export const stockMovementService = createApi({
    reducerPath: "stockMovementApi",
    baseQuery: baseQuery,
    tagTypes: ["StockMovement"],
    endpoints: (builder) => ({
        getStockMovements: builder.query<ListResponseModel<StockMovementDto>, void>({
            query: () => "StockMovement/details",
        }),
    }),
});

export const { useGetStockMovementsQuery } = stockMovementService;
