import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// ticket category routes
router.get("/categories/:id", TicketController.getTicketCategoryById);
router.put(
  "/categories/:id",
  authenticate,
  TicketController.updateTicketCategory
);
router.delete(
  "/categories/:id",
  authenticate,
  TicketController.deleteTicketCategory
);

// generate tickets for a category
router.post(
  "/categories/:id/generate",
  authenticate,
  TicketController.generateTickets
);

router.get(
  "/categories/:id/tickets",
  authenticate,
  TicketController.getTicketByCategoryId
);

// user tickets
router.get("/my-tickets", authenticate, TicketController.getUserTickets);

// ticket operations
router.get("/:id", authenticate, TicketController.getTicketById);
router.put("/:id", authenticate, TicketController.updateTicket);

export default router;
