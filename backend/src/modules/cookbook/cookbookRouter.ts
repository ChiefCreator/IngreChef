import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";
import { authMiddleware } from "../../middleware/authMiddleware";

import CookbookController from "./cookbookController";

const router = Router();
const cookbookController = new CookbookController();

router.get("/", authMiddleware, cookbookController.getCookbooks);
router.get("/:cookbookId", authMiddleware, transformQueryGetAllRecipesParams, cookbookController.getCookbook);
router.post("/", authMiddleware, cookbookController.createCookbook);
router.post("/:cookbookId", authMiddleware, cookbookController.addRecipeToCookbook);
router.delete("/:cookbookId", authMiddleware, cookbookController.removeRecipeFromCookbook);

export default router;