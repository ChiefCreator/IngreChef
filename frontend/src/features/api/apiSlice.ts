import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQueryWithReauth";

import type { Recipe } from "../../types/recipeTypes";
import type { RecipeQuery, FavoriteRecipeQuery } from "../../types/queryTypes";
import type { GetRecipeParams, AuthResponse, LoginRequest, RegisterRequest } from "./types";
import type { Cookbook } from "../../types/cookBookTypes";
import type { CookbookQuery, SingleCookbookQuery } from "../../types/queryTypes";

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
  tagTypes: ["Recipe", "FavoriteRecipe", "Cookbook"],
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
      providesTags: (result, __, { userId }) => {
        const recipeTag = result ?
          [
            ...result.map(({ id }: { id: string }) => ({ type: "Recipe" as const, id })),
            { type: "Recipe" as const, id: "List" },
          ] : [{ type: "Recipe" as const, id: "List" }];

        return [
          ...recipeTag,
          { type: "FavoriteRecipe", id: userId },
        ];
      }
    }),
    getRecipe: builder.query<Recipe, GetRecipeParams>({
      query: ({ userId, recipeId }) => {
        return `/recipes/${recipeId}?userId=${userId}`;
      },
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

    addRecipeToFavorite: builder.mutation<{ id: string; likedAt: string; userId: string; recipeId: string }, { userId: string; recipeId: string }>({
      query: ({ userId, recipeId }) => ({
        url: "/favorites",
        method: "POST",
        body: { userId, recipeId },
      }),
      async onQueryStarted({ userId, recipeId }, lifecycleApi) {
        const getRecipePatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
            if ("isFavorite" in draft) {
              draft.isFavorite = true;
            }
          })
        );

        try {
          await lifecycleApi.queryFulfilled;
        } catch {
          getRecipePatchResult.undo();
        }
      },
      invalidatesTags: (_, __, { recipeId }) => [{ type: "Recipe", id: "List" }, { type: "Recipe", id: recipeId }],
    }),
    deleteRecipeFromFavorite: builder.mutation<{ id: string; likedAt: string; userId: string; recipeId: string }, { userId: string; recipeId: string }>({
      query: ({ userId, recipeId }) => ({
        url: `/favorites?userId=${userId}&recipeId=${recipeId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ userId, recipeId }, lifecycleApi) {
        const getRecipePatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
            if ("isFavorite" in draft) {
              draft.isFavorite = false;
            }
          })
        );

        try {
          await lifecycleApi.queryFulfilled;
        } catch {
          getRecipePatchResult.undo();
        }
      },
      invalidatesTags: (_, __, { recipeId }) => [{ type: "Recipe", id: "List" }, { type: "Recipe", id: recipeId }],
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

    getCookBooks: builder.query<Cookbook[], CookbookQuery>({
      query: ({ userId }) => {
        return `/cookbooks/user/${userId}`;
      },
      providesTags: (_, __, ___) => ["Cookbook"],
    }),
    getCookBook: builder.query<Cookbook, SingleCookbookQuery>({
      query: ({ cookbookId, userId, titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite }) => {
        let query = `/cookbooks/${cookbookId}?userId=${userId}`;

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
      providesTags: (_, __, { cookbookId }) => [{ type: "Cookbook", id: cookbookId }],
    }),
    createCookbook: builder.mutation<Cookbook, { name: string; cookbookId: string; userId: string; colorPalette: Cookbook["colorPalette"] }>({
      query: ({ userId, cookbookId, name, colorPalette }) => ({
        url: "cookbooks",
        method: "POST",
        body: {
          userId,
          cookbookId,
          name,
          colorPalette,
        },
      }),
      async onQueryStarted({ userId, cookbookId, name, colorPalette }, { dispatch, queryFulfilled }) {
        const createdAt = new Date().toISOString();

        const getCookbooksPatchResult = dispatch(
          clientApi.util.updateQueryData("getCookBooks", { userId }, (draft) => {
            draft.push({ id: cookbookId, name, createdAt, recipes: [], colorPalette });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          getCookbooksPatchResult.undo();
        }
      },
      invalidatesTags: (cookbook, __, ___) => [{ type: "Cookbook", id: cookbook?.id }],
    }),

    removeRecipeFromCookbook: builder.mutation<Recipe, { userId: string, cookbookId: string; recipeId: string; }>({
      query: ({ userId, cookbookId, recipeId }) => ({
        url: `/cookbooks/${cookbookId}`,
        method: "DELETE",
        body: { userId, recipeId }
      }),
      async onQueryStarted({ userId, cookbookId, recipeId }, lifecycleApi) {
        const getCookBookPatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getCookBook", { cookbookId, userId }, draft => {
            const recipes = draft.recipes;
            const deleteRecipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);

            if (deleteRecipeIndex !== -1) {
              recipes.splice(deleteRecipeIndex, 1);
            }
          })
        );
        const getCookBooksPatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getCookBooks", { userId }, draft => {
            const currentCookbook = draft.find(cookbook => cookbook.id === cookbookId)!;
            const recipes = currentCookbook.recipes;
            const deleteRecipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);

            if (deleteRecipeIndex !== -1) {
              recipes.splice(deleteRecipeIndex, 1);
            }
          })
        );

        try {
          await lifecycleApi.queryFulfilled;
        } catch {
          getCookBookPatchResult.undo();
          getCookBooksPatchResult.undo();
        }
      },
    }),
    addRecipeToCookbook: builder.mutation<Recipe, { userId: string, cookbookId: string; recipeId: string; recipe: Recipe }>({
      query: ({ userId, cookbookId, recipeId }) => ({
        url: `/cookbooks/${cookbookId}`,
        method: "POST",
        body: { userId, recipeId }
      }),
      async onQueryStarted({ userId, cookbookId, recipeId, recipe }, lifecycleApi) {
        const getCookBookPatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getCookBook", { cookbookId, userId }, draft => {
            const recipes = draft.recipes as Recipe[];
            recipes.push(recipe);
          })
        );
        const getCookBooksPatchResult = lifecycleApi.dispatch(
          clientApi.util.updateQueryData("getCookBooks", { userId }, draft => {
            const currentCookbook = draft.find(cookbook => cookbook.id === cookbookId)!;
            const recipes = currentCookbook.recipes as Recipe[];
            recipes.push(recipe);
          })
        );

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getCookBookPatchResult.undo();
          getCookBooksPatchResult.undo();
        }
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    activate: builder.mutation<AuthResponse, { activationCode: String }>({
      query: ({ activationCode }) => ({
        url: `/auth/activate/${activationCode}`,
        method: "GET"
      }),
    }),
    refresh: builder.query({
      query: () => "/auth/refresh",
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useGetFavoriteRecipesIdsQuery,
  useAddRecipeToFavoriteMutation,
  useDeleteRecipeFromFavoriteMutation,
  useToggleRecipesIdsMutation,
  useGetUserRecipesQuery,
  useGetCookBooksQuery,
  useGetCookBookQuery,
  useRemoveRecipeFromCookbookMutation,
  useAddRecipeToCookbookMutation,
  useCreateCookbookMutation,

  useRegisterMutation,
  useLoginMutation,
  useActivateMutation
} = clientApi;
