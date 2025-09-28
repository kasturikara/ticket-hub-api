import { Router } from "express";

// routes
import authRouter from "./auth/auth.route";
import userRoutes from "./user/user.route";
import eventRoutes from "./event/event.route";

const router = Router();

// api routes
router.use("/auth", authRouter);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);

export default router;
