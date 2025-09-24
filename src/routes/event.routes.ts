import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { TicketController } from "../controllers/ticket.controller";

const router = Router();

// Event routes
router.get("/", EventController.getAllEvents);
router.post("/", authenticate, EventController.createEvent);
router.get("/user/me", authenticate, EventController.getMyEvents);
router.get("/:id", EventController.getEventById);
router.put("/:id", authenticate, EventController.updateEvent);
router.delete("/:id", authenticate, EventController.deleteEvent);

// Ticket category routes within events
router.get("/:id/ticket-categories", TicketController.getTicketCategories);

export default router;
