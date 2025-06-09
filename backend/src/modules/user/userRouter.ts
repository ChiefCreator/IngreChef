import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";
import { createEnumNormalizer } from "../../middleware/normalizeEnumFields";

import UserController from "./userController";

const normalizeRecipe = createEnumNormalizer({ fields: ["gender", "cookingLevel"], sources: ["body"] });

const router = Router();
const userController = new UserController();

router.get("/:userId", authMiddleware, userController.getUser);
router.patch("/:userId/profile", authMiddleware, normalizeRecipe, userController.updateUserProfile);

export default router;