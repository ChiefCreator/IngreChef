import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";
import { authMiddleware } from "../../middleware/authMiddleware";

import RecipeController from "./recipeController";

const router = Router();
const recipeController = new RecipeController();

router.get("/", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getAllRecipes);
router.get("/:recipeId", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getRecipe);
router.get("/user/:userId", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getUserRecipes);

router.get("/:recipeId/cookbook-ids", authMiddleware, recipeController.getCookbookIdsOfUserRecipe);

router.get("/favorite/user/:userId/ids", authMiddleware, recipeController.getFavoriteRecipesIds);
router.post("/favorite/user/:userId/ids", authMiddleware, recipeController.toggleFavoriteRecipesIds);

export default router;