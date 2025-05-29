import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import GenerateRecipeController from "./generateRecipeController";

const router = Router();
const generateRecipeController = new GenerateRecipeController();

router.post("/", authMiddleware, generateRecipeController.generateRecipes);

export default router;