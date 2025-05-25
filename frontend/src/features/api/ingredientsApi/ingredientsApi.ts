import { clientApi } from "../clientApi";

import type { Ingredient } from "./ingredientsTypes";

export const ingredientsApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getIngredients: builder.query<Ingredient[], { query: string }>({
      query: ({ query }) => `/ingredients?query=${query}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIngredientsQuery
} = ingredientsApi;