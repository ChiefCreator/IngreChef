import { Router } from "express";

import { transformQueryGetAllRecipesParams } from "../../middleware/transformQueryGetAllRecipesParams";

import CookbookController from "./cookbookController";

const router = Router();
const cookbookController = new CookbookController();

router.get("/user/:userId", cookbookController.getCookbooks);
router.get("/:cookbookId", transformQueryGetAllRecipesParams, cookbookController.getCookbook);
router.delete("/:cookbookId", cookbookController.removeRecipeFromCookbook);
router.post("/:cookbookId", cookbookController.addRecipeToCookbook);

export default router;