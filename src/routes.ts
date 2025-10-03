import { Router } from "express";

// routes
import authRouter from "./services/auth/auth.route";
import userRoutes from "./services/user/user.route";
import eventRoutes from "./services/event/event.route";

const router = Router();

// api routes
router.use("/auth", authRouter);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);

export default router;
