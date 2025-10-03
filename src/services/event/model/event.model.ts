import { supabase } from "../../../config/supabase";
import { IEvent } from "../event.interface";

export class EventModel {
  private static readonly EVENTS_TABLE = "events";

  // create a new event
  static async createEvent(userId: string, event: IEvent): Promise<IEvent> {
    const created_by = userId;

    const { data, error } = await supabase
      .from(this.EVENTS_TABLE)
      .insert({ ...event, created_by })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
    return data;
  }

  // get event by id
  static async getEventById(id: string): Promise<IEvent | null> {
    const { data, error } = await supabase
      .from(this.EVENTS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Event not found
      }
      throw new Error(`Failed to get event: ${error.message}`);
    }

    return data;
  }

  // update event
  static async updateEvent(
    id: string,
    event: Partial<IEvent>
  ): Promise<IEvent> {
    const { data, error } = await supabase
      .from(this.EVENTS_TABLE)
      .update(event)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return data;
  }

  // delete event
  static async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.EVENTS_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  // get all events with optional filtering and pagination
  static async getAllEvents(
    options: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    } = {}
  ): Promise<{ data: IEvent[]; total: number }> {
    const { page = 1, limit = 10, startDate, endDate, search } = options;

    const offset = (page - 1) * limit;

    let query = supabase
      .from(this.EVENTS_TABLE)
      .select("*", { count: "exact" });

    if (startDate) query = query.gte("start_date", startDate.toISOString());
    if (endDate) query = query.lte("end_date", endDate.toISOString());
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order("start_date", { ascending: true });

    if (error) {
      throw new Error(`Failed to get events: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }
}
