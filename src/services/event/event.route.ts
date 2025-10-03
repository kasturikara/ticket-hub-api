import { Router } from "express";
import { EventController } from "./event.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", authenticate, adminOnly, EventController.getAllEvents);
router.post("/", authenticate, adminOnly, EventController.createEvent);
router.get("/:id", authenticate, EventController.getEventById);
router.put("/:id", authenticate, adminOnly, EventController.updateEvent);
router.delete("/:id", authenticate, adminOnly, EventController.deleteEvent);

export default router;
