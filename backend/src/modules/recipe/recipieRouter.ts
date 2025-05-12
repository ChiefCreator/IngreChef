import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";

import RecipeController from "./recipeController";

const router = Router();
const recipeController = new RecipeController();

router.get("/", transformQueryGetAllRecipesParams, recipeController.getAllRecipes);
router.get("/:recipeId", transformQueryGetAllRecipesParams, recipeController.getRecipe);
router.get("/user/:userId", transformQueryGetAllRecipesParams, recipeController.getUserRecipes);

router.get("/:recipeId/cookbook-ids", recipeController.getCookbookIdsOfUserRecipe);

router.get("/favorite/user/:userId/ids", recipeController.getFavoriteRecipesIds);
router.post("/favorite/user/:userId/ids", recipeController.toggleFavoriteRecipesIds);

export default router;