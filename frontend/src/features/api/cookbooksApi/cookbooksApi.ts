import { clientApi } from "../clientApi";

import type { Recipe } from "../../../types/recipeTypes";
import type { Cookbook } from "../../../types/cookBookTypes";
import type { getCookBooksParams, getCookBookParams, CreateCookbookParams, RemoveRecipeFromCookbookParams, AddRecipeToCookbookParams } from "./cookbooksApiTypes";

export const cookbooksApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getCookBooks: builder.query<Cookbook[], getCookBooksParams>({
      query: ({ userId }) => {
        return `/cookbooks?userId=${userId}`;
      },
      providesTags: (_, __, ___) => ["Cookbook"],
    }),
    getCookBook: builder.query<Cookbook, getCookBookParams>({
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
      providesTags: (cookbook, __, { cookbookId }) => {
        const recipeTag = cookbook && cookbook?.recipes.length ?
          [
            ...cookbook.recipes.map(({ id }: { id: string }) => ({ type: "Recipe" as const, id })),
            { type: "Recipe" as const, id: "List" },
          ] : [{ type: "Recipe" as const, id: "List" }];

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
            const recipes = draft.recipes;
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
      async onQueryStarted({ userId, cookbookId, recipeId, recipe }, lifecycleApi) {
        const getCookBookPatchResult = lifecycleApi.dispatch(
          cookbooksApi.util.updateQueryData("getCookBook", { cookbookId, userId }, draft => {
            const recipes = draft.recipes as Recipe[];
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
  useRemoveRecipeFromCookbookMutation,
  useAddRecipeToCookbookMutation,
  useCreateCookbookMutation,
} = cookbooksApi;
