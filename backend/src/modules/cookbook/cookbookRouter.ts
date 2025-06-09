import { Router } from "express";

import { createEnumNormalizer } from "../../middleware/normalizeEnumFields";
import { authMiddleware } from "../../middleware/authMiddleware";

import CookbookController from "./cookbookController";

const normalizeRecipe = createEnumNormalizer({ fields: ["category", "difficulty", "cuisine"], sources: ["query"] });

const router = Router();
const cookbookController = new CookbookController();

router.get("/", authMiddleware, cookbookController.getCookbooks);
router.get("/:cookbookId", authMiddleware, normalizeRecipe, cookbookController.getCookbook);
router.post("/", authMiddleware, cookbookController.createCookbook);
router.post("/:cookbookId", authMiddleware, cookbookController.addRecipeToCookbook);
router.delete("/:cookbookId", authMiddleware, cookbookController.removeRecipeFromCookbook);

export default router;