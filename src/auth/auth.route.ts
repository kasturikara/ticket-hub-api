import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// auth routes
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
