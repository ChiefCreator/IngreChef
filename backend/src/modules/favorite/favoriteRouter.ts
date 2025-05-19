import { Router } from "express";

import Controller from "./favoriteController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const controller = new Controller();

router.post("/", authMiddleware, controller.addFavorite);
router.delete("/", authMiddleware, controller.deleteFavorite);

export default router;