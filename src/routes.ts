import { Router } from "express";

// routes
import userRoutes from "./user/user.route";

const router = Router();

// api routes
router.use("/users", userRoutes);

export default router;
