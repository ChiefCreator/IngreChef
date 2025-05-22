import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth";
import { delay } from "../../lib/functionsUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const delayedBaseQuery = (ms: number = 1000) => async (...args: Parameters<ReturnType<typeof fetchBaseQuery>>) => {
  await delay(ms)
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
  })
  return baseQuery(...args)
}

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Recipe", "Cookbook"],
  endpoints: () => ({}),
});
