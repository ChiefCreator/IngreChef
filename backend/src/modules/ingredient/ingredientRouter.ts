import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import IngredientController from "./ingredientController";

const router = Router();
const recipeController = new IngredientController();

router.get("/", authMiddleware, recipeController.getIngredients);

export default router;