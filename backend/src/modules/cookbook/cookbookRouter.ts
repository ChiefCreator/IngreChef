import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";
import { authMiddleware } from "../../middleware/authMiddleware";

import CookbookController from "./cookbookController";

const router = Router();
const cookbookController = new CookbookController();

router.post("/", authMiddleware, cookbookController.createCookbook);
router.get("/user/:userId", authMiddleware, cookbookController.getCookbooks);
router.get("/:cookbookId", authMiddleware, transformQueryGetAllRecipesParams, cookbookController.getCookbook);
router.delete("/:cookbookId", authMiddleware, cookbookController.removeRecipeFromCookbook);
router.post("/:cookbookId", authMiddleware, cookbookController.addRecipeToCookbook);

export default router;