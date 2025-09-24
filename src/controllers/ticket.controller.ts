import { Request, Response } from "express";
import { catchAsync } from "../middleware/error.handler";
import { TicketService } from "../services/ticket.service";
import { BadRequestError } from "../utils/errors";

export class TicketController {
  // generate tickets for a category
  static generateTickets = catchAsync(async (req: Request, res: Response) => {
    const ticketCategoryId = req.params.id;
    const userId = req.user.id;

    const result = await TicketService.generateTicketsForCategory(
      ticketCategoryId,
      userId
    );

    res.status(201).json({
      success: true,
      message: `Successfully generated ${result.generated_count} tickets.`,
      data: result,
    });
  });

  // Get ticket categories for an event
  static getTicketCategories = catchAsync(
    async (req: Request, res: Response) => {
      const eventId = req.params.id;
      const categories = await TicketService.getTicketCategoriesByEventId(
        eventId
      );

      res.status(200).json({
        success: true,
        message: "Ticket categories retrieved successfully",
        data: categories,
      });
    }
  );

  // Create a ticket category
  static createTicketCategory = catchAsync(
    async (req: Request, res: Response) => {
      const eventId = req.params.id;
      const categoryData = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (
        !categoryData.name ||
        !categoryData.price ||
        categoryData.stock === undefined
      ) {
        throw new BadRequestError("Missing required category information");
      }

      const category = await TicketService.createTicketCategory(
        eventId,
        categoryData,
        userId
      );

      res.status(201).json({
        success: true,
        message: "Ticket category created successfully",
        data: category,
      });
    }
  );

  // Get ticket category by ID
  static getTicketCategoryById = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.id;
      const category = await TicketService.getTicketCategoryById(categoryId);

      res.status(200).json({
        success: true,
        message: "Ticket category retrieved successfully",
        data: category,
      });
    }
  );

  // Update ticket category
  static updateTicketCategory = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.id;
      const updateData = req.body;
      const userId = req.user.id;

      const updatedCategory = await TicketService.updateTicketCategory(
        categoryId,
        updateData,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Ticket category updated successfully",
        data: updatedCategory,
      });
    }
  );

  // Delete ticket category
  static deleteTicketCategory = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.id;
      const userId = req.user.id;

      await TicketService.deleteTicketCategory(categoryId, userId);

      res.status(200).json({
        success: true,
        message: "Ticket category deleted successfully",
      });
    }
  );

  // Get user tickets
  static getUserTickets = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const tickets = await TicketService.getTickets({ user_id: userId });

    res.status(200).json({
      success: true,
      message: "User tickets retrieved successfully",
      data: tickets,
    });
  });

  // get ticket by ID
  static getTicketById = catchAsync(async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const ticket = await TicketService.getTicketById(ticketId);
    res.status(200).json({
      success: true,
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  });

  static getTicketByCategoryId = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.id;
      const tickets = await TicketService.getTicketsByCategoryId(categoryId);
      res.status(200).json({
        success: true,
        message: "Tickets retrieved successfully",
        data: tickets,
      });
    }
  );

  static getTicketByUserId = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const tickets = await TicketService.getTickets({ user_id: userId });
    res.status(200).json({
      success: true,
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  });

  // Update ticket
  static updateTicket = catchAsync(async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const updateData = req.body;
    const userId = req.user.id;

    const updatedTicket = await TicketService.updateTicket(
      ticketId,
      updateData,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  });
}
