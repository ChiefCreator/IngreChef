import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import GenerateRecipeController from "./GenerateRecipeController";

const router = Router();
const generateRecipeController = new GenerateRecipeController();

router.post("/", generateRecipeController.generateRecipe);

export default router;