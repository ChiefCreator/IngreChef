import { Router } from "express";

import { authMiddleware } from "../../middleware/authMiddleware";

import Controller from "./authController";

const router = Router();
const controller = new Controller();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/activate/:activationCode", controller.activate);
router.get("/refresh", controller.refresh);

router.post("/request-email-change", authMiddleware, controller.requestEmailChange);
router.get("/confirm-change-email/:code", controller.confirmEmailChange);

export default router;