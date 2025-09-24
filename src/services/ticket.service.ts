import {
  ITicket,
  ITicketCategory,
  ITicketQueryParams,
  IUpdateTicketRequest,
} from "../interfaces/ticket.interfaces";
import { EventModel } from "../models/event.model";
import { TicketModel } from "../models/ticket.model";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export class TicketService {
  // generate tickets for a category
  static async generateTicketsForCategory(
    ticketCategoryId: string,
    userId: string
  ): Promise<{ generated_count: number; total_count: number }> {
    // get ticket category
    const ticketCategory = await TicketModel.getTicketCategoryById(
      ticketCategoryId
    );
    if (!ticketCategory)
      throw new NotFoundError(
        `Ticket category with ID ${ticketCategoryId} not found`
      );

    // get event to check ownership
    const event = await EventModel.getById(ticketCategory.event_id!);
    if (!event)
      throw new NotFoundError("Event not found for the ticket category");

    // check if user is the event admin
    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You do not have permission to generate tickets for this category"
      );
    }

    // count existing tickets
    const existingTicketsCount = await TicketModel.countTicketsByCategory(
      ticketCategoryId
    );

    // calculate how many tickets can be generated
    const ticketsToGenerate = ticketCategory.stock - existingTicketsCount;
    if (ticketsToGenerate <= 0) {
      return {
        generated_count: 0,
        total_count: existingTicketsCount,
      };
    }

    // generate tickets
    const result = await TicketModel.generateTicketsForCategory(
      ticketCategoryId,
      ticketsToGenerate
    );

    return {
      generated_count: result.generated,
      total_count: existingTicketsCount + result.generated,
    };
  }

  // get ticket by ID
  static async getTicketById(id: string): Promise<ITicket> {
    const ticket = await TicketModel.getTicketById(id);

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  // Get tickets with filters
  static async getTickets(
    queryParams: ITicketQueryParams = {}
  ): Promise<ITicket[]> {
    return await TicketModel.getTickets(queryParams);
  }

  static async getTicketsByCategoryId(
    ticketCategoryId: string
  ): Promise<ITicket[]> {
    return await TicketModel.getTicketsByCategoryId(ticketCategoryId);
  }

  // Update ticket
  static async updateTicket(
    id: string,
    updateData: IUpdateTicketRequest,
    userId: string
  ): Promise<ITicket> {
    const ticket = await this.getTicketById(id);

    // Check if user owns the ticket
    if (ticket.user_id && ticket.user_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to update this ticket"
      );
    }

    return await TicketModel.updateTicket(id, updateData);
  }

  // get ticket category by ID
  static async getTicketCategoryById(id: string): Promise<ITicketCategory> {
    const category = await TicketModel.getTicketCategoryById(id);

    if (!category) {
      throw new NotFoundError(`Ticket category with ID ${id} not found`);
    }

    return category;
  }

  // Get ticket categories for event
  static async getTicketCategoriesByEventId(
    eventId: string
  ): Promise<ITicketCategory[]> {
    return await TicketModel.getTicketCategoriesByEventId(eventId);
  }

  // Create ticket category
  static async createTicketCategory(
    eventId: string,
    categoryData: ITicketCategory,
    userId: string
  ): Promise<ITicketCategory> {
    // Check if the event exists and user is the owner
    const event = await EventModel.getById(eventId);
    if (!event) {
      throw new NotFoundError(`Event with ID ${eventId} not found`);
    }

    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to create ticket categories for this event"
      );
    }

    // Create the category
    const newCategory: ITicketCategory = {
      ...categoryData,
      event_id: eventId,
      available: 0, // Initially 0 available tickets
    };

    return await TicketModel.createTicketCategory(newCategory);
  }

  // Update ticket category
  static async updateTicketCategory(
    id: string,
    updateData: Partial<ITicketCategory>,
    userId: string
  ): Promise<ITicketCategory> {
    // Get the category
    const category = await TicketModel.getTicketCategoryById(id);
    if (!category) {
      throw new NotFoundError(`Ticket category with ID ${id} not found`);
    }

    // Check if the user is the event owner
    const event = await EventModel.getById(category.event_id!);
    if (!event) {
      throw new NotFoundError(`Event not found for ticket category`);
    }

    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to update this ticket category"
      );
    }

    return await TicketModel.updateTicketCategory(id, updateData);
  }

  // delete ticket category
  static async deleteTicketCategory(id: string, userId: string): Promise<void> {
    // Get the category
    const category = await TicketModel.getTicketCategoryById(id);
    if (!category) {
      throw new NotFoundError(`Ticket category with ID ${id} not found`);
    }

    // Check if the user is the event owner
    const event = await EventModel.getById(category.event_id!);
    if (!event) {
      throw new NotFoundError(`Event not found for ticket category`);
    }
    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to delete this ticket category"
      );
    }
    await TicketModel.deleteTicketCategory(id);
  }
}
