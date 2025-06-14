import { clientApi } from "../clientApi";

import type { Recipe } from "../../../types/recipeTypes";
import type { QueryRecipeFilter } from "../../../types/queryTypes";
import type { RecipesResponse, GetRecipeParams, AddRecipeParams, FavoriteRecipeResponse, FavoriteRecipeParams, GenerateRecipeParams } from "./recipesApiTypes";

export const recipesApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipesResponse, QueryRecipeFilter>({
      query: ({ userId, pagination, filters }) => {
        const { cursor, limit = 12 } = pagination || {};
        const { titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite } = filters || {};

        let query = `/recipes?userId=${userId}&cursor=${cursor}&limit=${limit}`;
      
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
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify(queryArgs.filters ?? {})}`;
      },
      merge: (currentCache, newData) => {
        const map = new Map<string, typeof newData.recipes[0]>();
      
        currentCache.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });

        newData.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });
      
        currentCache.recipes = Array.from(map.values());
      
        currentCache.nextCursor = newData.nextCursor;
      },
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg?.filters) !== JSON.stringify(previousArg?.filters);
      },
      transformResponse: (response: RecipesResponse) => response,
    }),
    getUserRecipes: builder.query<RecipesResponse, QueryRecipeFilter>({
      query: ({ userId, pagination, filters }) => {
        const { cursor, limit = 12 } = pagination || {};
        const { titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite } = filters || {};

        let query = `/recipes/user/${userId}?cursor=${cursor}&limit=${limit}`;
      
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
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify(queryArgs.filters ?? {})}`;
      },
      merge: (currentCache, newData) => {
        const map = new Map<string, typeof newData.recipes[0]>();
      
        currentCache.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });

        newData.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });
      
        currentCache.recipes = Array.from(map.values());
      
        currentCache.nextCursor = newData.nextCursor;
      },
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg?.filters) !== JSON.stringify(previousArg?.filters);
      },
      transformResponse: (response: RecipesResponse) => response,
    }),
    getRecipe: builder.query<Recipe, GetRecipeParams>({
      query: ({ userId, recipeId }) => {
        return `/recipes/${recipeId}?userId=${userId}`;
      },
    }),

    selectGeneratedRecipe: builder.mutation<Recipe, AddRecipeParams>({
      query: (body) => ({
        url: "/recipes/select",
        method: "POST",
        body,
      }),
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
            const recipe = draft.recipes.find(r => r.id === recipeId);
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
            const index = draft.recipes.findIndex(r => r.id === recipeId);

            if (index !== -1) {
              if (args.filters?.isFavorite) {
                draft.recipes.splice(index, 1);
              } else {
                draft.recipes[index].isFavorite = false;
              }
            }
          })
        ));

        const allCachedGetUserRecipes = recipesApi.util.selectCachedArgsForQuery(state, "getUserRecipes");
        const relevantGetUserRecipesCaches = allCachedGetUserRecipes.filter(args => args.userId === userId);

        const getUserRecipesPatchResults = relevantGetUserRecipesCaches.map((args) =>
          dispatch(recipesApi.util.updateQueryData("getUserRecipes", args, (draft) => {
            const index = draft.recipes.findIndex(r => r.id === recipeId);

            if (index !== -1) {
              if (args.filters?.isFavorite) {
                draft.recipes.splice(index, 1);
              } else {
                draft.recipes[index].isFavorite = false;
              }
            }
          })
        ));

        try {
          await queryFulfilled;
        } catch {
          getRecipePatchResult.undo();
          getRecipesPatchResults.forEach(f => f.undo());
          getUserRecipesPatchResults.forEach(f => f.undo());
        }
      },
      invalidatesTags: (_, __, { recipeId }) => [{ type: "Recipe", id: "List" }, { type: "Recipe", id: recipeId }],
    }),

    generateRecipe: builder.mutation<Recipe[], GenerateRecipeParams>({
      query: (body) => ({
        url: `/generate-recipe`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecipesQuery,
  useLazyGetRecipesQuery,
  useGetUserRecipesQuery,
  useLazyGetUserRecipesQuery,
  useGetRecipeQuery,

  useSelectGeneratedRecipeMutation,
  useAddRecipeToFavoriteMutation,
  useDeleteRecipeFromFavoriteMutation,
  useGenerateRecipeMutation,
} = recipesApi;
