import { clientApi } from "./clientApi";

import type { Recipe } from "../../types/recipeTypes";
import type { RecipeQuery, FavoriteRecipeQuery } from "../../types/queryTypes";
import type { GetRecipeParams } from "./types";

export const recipesApi = clientApi.injectEndpoints({
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
      providesTags: (result, __, ___) => {
        const recipeTag = result ?
          [
            ...result.map(({ id }: { id: string }) => ({ type: "Recipe" as const, id })),
            { type: "Recipe" as const, id: "List" },
          ] : [{ type: "Recipe" as const, id: "List" }];

        return [
          ...recipeTag,
        ];
      }
    }),

    addRecipeToFavorite: builder.mutation<{ id: string; likedAt: string; userId: string; recipeId: string }, { userId: string; recipeId: string }>({
      query: ({ userId, recipeId }) => ({
        url: "/favorites",
        method: "POST",
        body: { userId, recipeId },
      }),
      async onQueryStarted({ userId, recipeId }, lifecycleApi) {
        const getRecipePatchResult = lifecycleApi.dispatch(
          recipesApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
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
          recipesApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
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
      providesTags: (_, __, { userId }) => [{ type: "Recipe", id: "List" }, { type: "FavoriteRecipe", id: userId }],
    }),
    toggleRecipesIds: builder.mutation<string[], { userId: string, recipeId: string }>({
      query: ({ userId, recipeId }) => ({
        url: `/recipes/favorite/user/${userId}/ids`,
        method: "POST",
        body: { recipeId }
      }),
      async onQueryStarted({ userId, recipeId }, lifecycleApi) {
        const getFavoriteRecipesIdsPatchResult = lifecycleApi.dispatch(
          recipesApi.util.updateQueryData("getFavoriteRecipesIds", { userId }, draft => {
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
  overrideExisting: false,
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useGetFavoriteRecipesIdsQuery,
  useAddRecipeToFavoriteMutation,
  useDeleteRecipeFromFavoriteMutation,
  useToggleRecipesIdsMutation,
  useGetUserRecipesQuery,
} = recipesApi;
