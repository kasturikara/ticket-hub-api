import { supabase } from "../config/supabase";
import { IEvent, IEventQueryParams } from "../interfaces/event.interfaces";

export class EventModel {
  private static readonly EVENT_TABLE = "events";
  private static readonly TICKET_CATEGORY_TABLE = "ticket_categories";
  private static readonly TICKET_TABLE = "tickets";

  // Event methods
  static async create(eventData: IEvent): Promise<IEvent> {
    const { data, error } = await supabase
      .from(this.EVENT_TABLE)
      .insert(eventData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return data;
  }

  static async getAll(queryParams: IEventQueryParams = {}): Promise<IEvent[]> {
    let query = supabase.from(this.EVENT_TABLE).select("*");

    // Apply filters
    if (queryParams.startDate) {
      query = query.gte("event_date", queryParams.startDate);
    }

    if (queryParams.endDate) {
      query = query.lte("event_date", queryParams.endDate);
    }

    if (queryParams.location) {
      query = query.ilike("location", `%${queryParams.location}%`);
    }

    if (queryParams.admin_id) {
      query = query.eq("admin_id", queryParams.admin_id);
    }

    // Apply pagination
    if (queryParams.limit) {
      query = query.limit(queryParams.limit);
    }

    if (queryParams.offset) {
      query = query.range(
        queryParams.offset,
        queryParams.offset + (queryParams.limit || 10) - 1
      );
    }

    // Order by event date
    query = query.order("event_date", { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return data || [];
  }

  static async getById(id: string): Promise<IEvent | null> {
    const { data, error } = await supabase
      .from(this.EVENT_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No record found
      }
      throw new Error(`Failed to fetch event: ${error.message}`);
    }

    return data;
  }

  static async update(id: string, eventData: Partial<IEvent>): Promise<IEvent> {
    const updates = {
      ...eventData,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from(this.EVENT_TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.EVENT_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  static async getByAdminId(admin_id: string): Promise<IEvent[]> {
    const { data, error } = await supabase
      .from(this.EVENT_TABLE)
      .select("*")
      .eq("admin_id", admin_id)
      .order("event_date", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch admin events: ${error.message}`);
    }

    return data || [];
  }

  static async countEvents(
    queryParams: IEventQueryParams = {}
  ): Promise<number> {
    let query = supabase
      .from(this.EVENT_TABLE)
      .select("*", { count: "exact", head: true });

    // Apply the same filters as getAll
    if (queryParams.startDate) {
      query = query.gte("event_date", queryParams.startDate);
    }

    if (queryParams.endDate) {
      query = query.lte("event_date", queryParams.endDate);
    }

    if (queryParams.location) {
      query = query.ilike("location", `%${queryParams.location}%`);
    }

    if (queryParams.admin_id) {
      query = query.eq("admin_id", queryParams.admin_id);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count events: ${error.message}`);
    }

    return count || 0;
  }
}
