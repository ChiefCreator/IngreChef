import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Recipe } from "../../types/recipeTypes";
import type { RecipeQuery, FavoriteRecipeQuery } from "../../types/queryTypes";

import { delay } from "../../lib/functionsUtils";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const delayedBaseQuery = (ms: number = 1000) => async (...args: Parameters<ReturnType<typeof fetchBaseQuery>>) => {
  await delay(ms)
  const baseQuery = fetchBaseQuery({ baseUrl: baseUrl })
  return baseQuery(...args)
}

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: delayedBaseQuery(2000),
  tagTypes: ["FavoriteRecipe"],
  endpoints: (builder) => ({
    getRecipes: builder.query<Recipe[], RecipeQuery>({
      query: ({ userId, page, limit, titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite }) => {
        let query = `/recipes?userId=${userId}&page=${page}&limit=${limit}`;
      
        if (titleStartsWith) {
          query += `&titleStartsWith=${titleStartsWith}`;
        }
        if (category) {
          query += `&category=${category}`;
        }
        if (difficulty) {
          query += `&difficulty=${difficulty}`;
        }
        if (cuisine) {
          query += `&cuisine=${cuisine}`;
        }
        if (cookingTime) {
          query += `&cookingTime=${JSON.stringify(cookingTime)}`;
        }
        if (ingredients && ingredients.length) {
          query += `&ingredients=${ingredients.join(",")}`;
        }
        if (isFavorite) {
          query += `&isFavorite=${isFavorite}`;
        }

        return query;
      },
      providesTags: (_, __, { userId }) => [{ type: "FavoriteRecipe", id: userId }],
    }),
    getUserRecipes: builder.query<Recipe[], RecipeQuery>({
      query: ({ userId, page, limit, titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite }) => {
        let query = `/recipes/user/${userId}?page=${page}&limit=${limit}`;

        if (titleStartsWith) {
          query += `&titleStartsWith=${titleStartsWith}`;
        }
        if (category) {
          query += `&category=${category}`;
        }
        if (difficulty) {
          query += `&difficulty=${difficulty}`;
        }
        if (cuisine) {
          query += `&cuisine=${cuisine}`;
        }
        if (cookingTime) {
          query += `&cookingTime=${JSON.stringify(cookingTime)}`;
        }
        if (ingredients && ingredients.length) {
          query += `&ingredients=${ingredients.join(",")}`;
        }
        if (isFavorite) {
          query += `&isFavorite=${isFavorite}`;
        }

        return query;
      },
    }),
    getFavoriteRecipesIds: builder.query<string[], FavoriteRecipeQuery>({
      query: ({ userId }) => {
        return `/recipes/favorite/user/${userId}/ids`;
      },
      providesTags: (_, __, { userId }) => [{ type: "FavoriteRecipe", id: userId }],
    }),
    toggleRecipesIds: builder.mutation<string[], { userId: string, recipeId: string }>({
      query: ({ userId, recipeId }) => ({
        url: `/recipes/favorite/user/${userId}/ids`,
        method: "POST",
        body: { recipeId }
      }),
      async onQueryStarted({ userId, recipeId }, lifecycleApi) {
        const getFavoriteRecipesIdsPatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getFavoriteRecipesIds", { userId }, draft => {
            const index = draft.findIndex(id => id === recipeId);

            if (index !== -1) {
              draft.splice(index, 1);
            } else {
              draft.push(recipeId);
            }
          })
        )

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getFavoriteRecipesIdsPatchResult.undo()
        }
      },
      invalidatesTags: (_, __, { userId }) => [{ type: "FavoriteRecipe", id: userId }],
    }),
  }),
});

export const { useGetRecipesQuery, useGetFavoriteRecipesIdsQuery, useToggleRecipesIdsMutation, useGetUserRecipesQuery } = clientApi;
