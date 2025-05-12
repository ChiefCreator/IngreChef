import { Router } from "express";

import Controller from "./favoriteController";

const router = Router();
const controller = new Controller();

router.post("/", controller.addFavorite);
router.delete("/", controller.deleteFavorite);

export default router;