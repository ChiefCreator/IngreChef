import { Router } from "express";

import { createEnumNormalizer } from "../../middleware/normalizeEnumFields";
import { authMiddleware } from "../../middleware/authMiddleware";

import RecipeController from "./recipeController";

const normalizeRecipe = createEnumNormalizer({ fields: ["category", "difficulty", "cuisine"], sources: ["query"] });

const router = Router();
const recipeController = new RecipeController();

router.get("/", authMiddleware, normalizeRecipe, recipeController.getAllRecipes);
router.get("/:recipeId", authMiddleware, normalizeRecipe, recipeController.getRecipe);
router.get("/user/:userId", authMiddleware, normalizeRecipe, recipeController.getUserRecipes);

router.post("/select", authMiddleware, recipeController.selectGeneratedRecipe);

export default router;