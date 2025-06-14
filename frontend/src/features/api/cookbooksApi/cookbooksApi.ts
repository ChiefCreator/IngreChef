import { clientApi } from "../clientApi";

import type { Recipe } from "../../../types/recipeTypes";
import type { Cookbook } from "../../../types/cookBookTypes";
import type { QueryRecipeFilter } from "../../../types/queryTypes";
import type { getCookbookResponse, getCookBooksParams, CreateCookbookParams, RemoveRecipeFromCookbookParams, AddRecipeToCookbookParams } from "./cookbooksApiTypes";

export const cookbooksApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getCookBooks: builder.query<Cookbook[], getCookBooksParams>({
      query: ({ userId }) => {
        return `/cookbooks?userId=${userId}`;
      },
      providesTags: (_, __, ___) => ["Cookbook"],
    }),
    getCookBook: builder.query<getCookbookResponse, QueryRecipeFilter>({
      query: ({ cookbookId, userId, pagination, filters }) => {
        const { cursor, limit = 12 } = pagination || {};
        const { titleStartsWith, category, difficulty, cuisine, cookingTime, ingredients, isFavorite } = filters || {};

        let query = `/cookbooks/${cookbookId}?userId=${userId}&cursor=${cursor}&limit=${limit}`;
      
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
        const map = new Map<string, typeof newData.cookbook.recipes[0]>();
      
        currentCache.cookbook.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });

        newData.cookbook.recipes.forEach(recipe => {
          map.set(recipe.id, recipe);
        });
      
        currentCache.cookbook.recipes = Array.from(map.values());
      
        currentCache.nextRecipeCursor = newData.nextRecipeCursor;
      },
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg?.filters) !== JSON.stringify(previousArg?.filters);
      },
      transformResponse: (response: getCookbookResponse) => response,
      providesTags: (cookbookResponse, __, { cookbookId }) => {
        const cookbook = cookbookResponse?.cookbook;
        const recipes = cookbook?.recipes ?? [];

        const recipeTag = recipes.length ?
          [
            ...recipes.map(({ id }: { id: string }) => ({ type: "Recipe" as const, id })),
            { type: "Recipe" as const, id: "List" },
          ] :
          [
            { type: "Recipe" as const, id: "List" }
          ];

        return [
          { type: "Cookbook", id: cookbookId },
          ...recipeTag,
        ];
      }
    }),
    createCookbook: builder.mutation<Cookbook, CreateCookbookParams>({
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
          cookbooksApi.util.updateQueryData("getCookBooks", { userId }, (draft) => {
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

    removeRecipeFromCookbook: builder.mutation<Recipe, RemoveRecipeFromCookbookParams>({
      query: ({ userId, cookbookId, recipeId }) => ({
        url: `/cookbooks/${cookbookId}`,
        method: "DELETE",
        body: { userId, recipeId }
      }),
      async onQueryStarted({ userId, cookbookId, recipeId }, lifecycleApi) {
        const getCookBookPatchResult = lifecycleApi.dispatch(
          cookbooksApi.util.updateQueryData("getCookBook", { cookbookId, userId }, draft => {
            const recipes = draft.cookbook.recipes;
            const deleteRecipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);

            if (deleteRecipeIndex !== -1) {
              recipes.splice(deleteRecipeIndex, 1);
            }
          })
        );
        const getCookBooksPatchResult = lifecycleApi.dispatch(
          cookbooksApi.util.updateQueryData("getCookBooks", { userId }, draft => {
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
    addRecipeToCookbook: builder.mutation<Recipe, AddRecipeToCookbookParams>({
      query: ({ userId, cookbookId, recipeId }) => ({
        url: `/cookbooks/${cookbookId}`,
        method: "POST",
        body: { userId, recipeId }
      }),
      async onQueryStarted({ userId, cookbookId, recipe }, lifecycleApi) {
        const getCookBookPatchResult = lifecycleApi.dispatch(
          cookbooksApi.util.updateQueryData("getCookBook", { cookbookId, userId }, draft => {
            const recipes = draft.cookbook.recipes as Recipe[];
            recipes.push(recipe);
          })
        );
        const getCookBooksPatchResult = lifecycleApi.dispatch(
          cookbooksApi.util.updateQueryData("getCookBooks", { userId }, draft => {
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
  }),
  overrideExisting: false,
});

export const {
  useGetCookBooksQuery,
  useGetCookBookQuery,
  useLazyGetCookBookQuery,
  useRemoveRecipeFromCookbookMutation,
  useAddRecipeToCookbookMutation,
  useCreateCookbookMutation,
} = cookbooksApi;
