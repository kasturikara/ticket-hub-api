import { supabase } from "../config/supabase";
import {
  ITicket,
  ITicketCategory,
  ITicketQueryParams,
  TicketStatus,
} from "../interfaces/ticket.interfaces";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

export class TicketModel {
  private static readonly TICKET_TABLE = "tickets";
  private static readonly TICKET_CATEGORY_TABLE = "ticket_categories";

  // ticket category methods
  static async createTicketCategory(
    categoryData: ITicketCategory
  ): Promise<ITicketCategory> {
    const { data, error } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ticket category: ${error.message}`);
    }

    return data;
  }

  static async getTicketCategoryById(
    id: string
  ): Promise<ITicketCategory | null> {
    const { data, error } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No record found
      }
      throw new Error(`Failed to fetch ticket category: ${error.message}`);
    }

    return data;
  }

  static async updateTicketCategory(
    id: string,
    categoryData: Partial<ITicketCategory>
  ): Promise<ITicketCategory> {
    const updates = {
      ...categoryData,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ticket category: ${error.message}`);
    }

    return data;
  }

  static async deleteTicketCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete ticket category: ${error.message}`);
    }
  }

  static async getTicketCategoriesByEventId(
    eventId: string
  ): Promise<ITicketCategory[]> {
    const { data, error } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .select("*")
      .eq("event_id", eventId);

    if (error) {
      throw new Error(`Failed to fetch ticket categories: ${error.message}`);
    }

    return data || [];
  }

  // ticket methods
  static async createTicket(ticketData: Partial<ITicket>): Promise<ITicket> {
    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .insert(ticketData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create ticket: ${error.message}`);

    return data;
  }

  static async createMultipleTickets(
    ticketsData: ITicket[]
  ): Promise<ITicket[]> {
    if (ticketsData.length === 0) return [];

    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .insert(ticketsData)
      .select();

    if (error) throw new Error(`Failed to create tickets: ${error.message}`);

    return data || [];
  }

  static async getTicketById(id: string): Promise<ITicket | null> {
    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No record found
      }
      throw new Error(`Failed to fetch ticket: ${error.message}`);
    }

    return data;
  }

  static async updateTicket(
    id: string,
    ticketData: Partial<ITicket>
  ): Promise<ITicket> {
    const updates = {
      ...ticketData,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ticket: ${error.message}`);
    }

    return data;
  }

  static async deleteTicket(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TICKET_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete ticket: ${error.message}`);
    }
  }

  static async getTickets(
    queryParams: ITicketQueryParams = {}
  ): Promise<ITicket[]> {
    let query = supabase.from(this.TICKET_TABLE).select("*");

    if (queryParams.event_id) {
      query = query.eq("event_id", queryParams.event_id);
    }

    if (queryParams.ticket_category_id) {
      query = query.eq("ticket_category_id", queryParams.ticket_category_id);
    }

    if (queryParams.status) {
      query = query.eq("status", queryParams.status);
    }

    if (queryParams.user_id) {
      query = query.eq("user_id", queryParams.user_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }

    return data || [];
  }

  static async getTicketsByCategoryId(
    ticketCategoryId: string
  ): Promise<ITicket[]> {
    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .select("*")
      .eq("ticket_category_id", ticketCategoryId);
    if (error) {
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }
    return data || [];
  }

  // Count tickets by category
  static async countTicketsByCategory(
    ticketCategoryId: string
  ): Promise<number> {
    const { count, error } = await supabase
      .from(this.TICKET_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("ticket_category_id", ticketCategoryId);

    if (error) {
      throw new Error(`Failed to count tickets: ${error.message}`);
    }

    return count || 0;
  }

  // Generate tickets for a category
  static async generateTicketsForCategory(
    ticketCategoryId: string,
    count: number
  ): Promise<{ generated: number; tickets: ITicket[] }> {
    if (count <= 0) {
      return { generated: 0, tickets: [] };
    }

    // Generate ticket data
    const ticketsToCreate: Partial<ITicket>[] = [];

    for (let i = 0; i < count; i++) {
      ticketsToCreate.push({
        ticket_category_id: ticketCategoryId,
        ticket_code: `TIX-${nanoid()}`, // Generate unique ticket code
        status: TicketStatus.AVAILABLE,
      });
    }

    // Create the tickets
    const { data, error } = await supabase
      .from(this.TICKET_TABLE)
      .insert(ticketsToCreate)
      .select();

    if (error) {
      throw new Error(`Failed to generate tickets: ${error.message}`);
    }

    // Update available count in ticket category
    await this.updateTicketCategoryAvailableCount(ticketCategoryId);

    return {
      generated: ticketsToCreate.length,
      tickets: data || [],
    };
  }

  // Update the available ticket count in the category
  static async updateTicketCategoryAvailableCount(
    ticketCategoryId: string
  ): Promise<void> {
    // Count available tickets
    const { count: availableCount, error: countError } = await supabase
      .from(this.TICKET_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("ticket_category_id", ticketCategoryId)
      .eq("status", TicketStatus.AVAILABLE);

    if (countError) {
      throw new Error(
        `Failed to count available tickets: ${countError.message}`
      );
    }

    // Update the category
    const { error: updateError } = await supabase
      .from(this.TICKET_CATEGORY_TABLE)
      .update({ available: availableCount })
      .eq("id", ticketCategoryId);

    if (updateError) {
      throw new Error(
        `Failed to update category available count: ${updateError.message}`
      );
    }
  }
}
