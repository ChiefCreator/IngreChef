import { Router } from "express";

import CookbookController from "./cookbookController";

const router = Router();
const cookbookController = new CookbookController();

router.get("/user/:userId", cookbookController.getCookbooks);

export default router;