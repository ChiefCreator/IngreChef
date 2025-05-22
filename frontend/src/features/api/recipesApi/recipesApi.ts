import { clientApi } from "../clientApi";

import type { Recipe } from "../../../types/recipeTypes";
import type { QueryRecipeFilter } from "../../../types/queryTypes";
import type { GetRecipeParams, FavoriteRecipeResponse, FavoriteRecipeParams } from "./recipesApiTypes";

export const recipesApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<Recipe[], QueryRecipeFilter>({
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
    }),
    getRecipe: builder.query<Recipe, GetRecipeParams>({
      query: ({ userId, recipeId }) => {
        return `/recipes/${recipeId}?userId=${userId}`;
      },
    }),
    getUserRecipes: builder.query<Recipe[], QueryRecipeFilter>({
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

    addRecipeToFavorite: builder.mutation<FavoriteRecipeResponse, FavoriteRecipeParams>({
      query: ({ userId, recipeId }) => ({
        url: "/favorites",
        method: "POST",
        body: { userId, recipeId },
      }),
      async onQueryStarted({ userId, recipeId }, { dispatch, getState, queryFulfilled }) {
        const state = getState();

        const getRecipePatchResult = dispatch(
          recipesApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
            if ("isFavorite" in draft) {
              draft.isFavorite = true;
            }
          })
        );

        const allCachedGetRecipes = recipesApi.util.selectCachedArgsForQuery(state, "getRecipes");
        const relevantCaches = allCachedGetRecipes.filter(args => args.userId === userId);

        const getRecipesPatchResults = relevantCaches.map((args) =>
          dispatch(recipesApi.util.updateQueryData("getRecipes", args, (draft) => {
            const recipe = draft.find(r => r.id === recipeId);
            if (recipe) recipe.isFavorite = true;
          })
        ));

        try {
          await queryFulfilled;
        } catch {
          getRecipePatchResult.undo();
          getRecipesPatchResults.forEach(f => f.undo());
        }
      },
      invalidatesTags: (_, __, { recipeId }) => [{ type: "Recipe", id: "List" }, { type: "Recipe", id: recipeId }],
    }),
    deleteRecipeFromFavorite: builder.mutation<FavoriteRecipeResponse, FavoriteRecipeParams>({
      query: ({ userId, recipeId }) => ({
        url: `/favorites?userId=${userId}&recipeId=${recipeId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ userId, recipeId }, { dispatch, getState, queryFulfilled }) {
        const state = getState();

        const getRecipePatchResult = dispatch(
          recipesApi.util.updateQueryData("getRecipe", { userId, recipeId }, (draft) => {
            if ("isFavorite" in draft) {
              draft.isFavorite = false;
            }
          })
        );

        const allCachedGetRecipes = recipesApi.util.selectCachedArgsForQuery(state, "getRecipes");
        const relevantCaches = allCachedGetRecipes.filter(args => args.userId === userId);

        const getRecipesPatchResults = relevantCaches.map((args) =>
          dispatch(recipesApi.util.updateQueryData("getRecipes", args, (draft) => {
            const recipe = draft.find(r => r.id === recipeId);
            if (recipe) recipe.isFavorite = false;
          })
        ));

        try {
          await queryFulfilled;
        } catch {
          getRecipePatchResult.undo();
          getRecipesPatchResults.forEach(f => f.undo());
        }
      },
      invalidatesTags: (_, __, { recipeId }) => [{ type: "Recipe", id: "List" }, { type: "Recipe", id: recipeId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecipesQuery,
  useGetUserRecipesQuery,
  useGetRecipeQuery,
  useAddRecipeToFavoriteMutation,
  useDeleteRecipeFromFavoriteMutation,
} = recipesApi;
