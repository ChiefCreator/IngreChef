import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";

import RecipeController from "./recipeController";

const router = Router();
const recipeController = new RecipeController();

router.get("/", transformQueryGetAllRecipesParams, recipeController.getAllRecipes);
router.get("/favorite-ids", recipeController.getFavoriteRecipesIds);
router.post("/favorite-ids", recipeController.toggleFavoriteRecipesIds);

export default router;