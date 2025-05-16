import { Router } from "express";

import Controller from "./authController";

const router = Router();
const controller = new Controller();

router.post("/register", controller.register);

export default router;