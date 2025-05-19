import { Router } from "express";

import Controller from "./authController";

const router = Router();
const controller = new Controller();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/activate/:activationCode", controller.activate);
router.get("/refresh", controller.refresh);

export default router;