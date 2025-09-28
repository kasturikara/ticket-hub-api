import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

// user routes
router.get("/me", authenticate, UserController.getMyProfile);
router.put("/me", authenticate, UserController.updateMyProfile);

// admin routes
router.get("/", authenticate, adminOnly, UserController.getAllProfiles);
router.get("/:id", authenticate, adminOnly, UserController.getUserProfile);
router.put("/:id", authenticate, adminOnly, UserController.updateUserProfile);

export default router;
