import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const API_URL = import.meta.env.PROD ?
"https://eruh.runasp.net/api" : "https://localhost:44381/api";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders:(headers) =>{
        const token = localStorage.getItem("token");
        if(token){
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
})