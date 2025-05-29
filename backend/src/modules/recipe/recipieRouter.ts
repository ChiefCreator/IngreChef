import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";
import { authMiddleware } from "../../middleware/authMiddleware";

import RecipeController from "./recipeController";

const router = Router();
const recipeController = new RecipeController();

router.get("/", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getAllRecipes);
router.get("/:recipeId", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getRecipe);
router.get("/user/:userId", authMiddleware, transformQueryGetAllRecipesParams, recipeController.getUserRecipes);

router.post("/select", authMiddleware, recipeController.selectGeneratedRecipe);

export default router;