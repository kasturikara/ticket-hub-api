import { EventModel } from "../models/event.model";
import {
  ICreateEventRequest,
  IEvent,
  IEventQueryParams,
  IUpdateEventRequest,
} from "../interfaces/event.interfaces";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors";

export class EventService {
  // Event methods
  static async createEvent(
    eventData: ICreateEventRequest,
    userId: string
  ): Promise<IEvent> {
    const event: IEvent = {
      admin_id: userId,
      title: eventData.title,
      description: eventData.description,
      event_date: new Date(eventData.event_date),
      location: eventData.location,
    };

    return await EventModel.create(event);
  }

  static async getAllEvents(
    queryParams: IEventQueryParams = {}
  ): Promise<{ events: IEvent[]; total: number }> {
    const events = await EventModel.getAll(queryParams);
    const total = await EventModel.countEvents(queryParams);

    return { events, total };
  }

  static async getEventById(id: string): Promise<IEvent> {
    const event = await EventModel.getById(id);

    if (!event) {
      throw new NotFoundError(`Event with ID ${id} not found`);
    }

    return event;
  }

  static async updateEvent(
    id: string,
    updateData: IUpdateEventRequest,
    userId: string
  ): Promise<IEvent> {
    const event = await this.getEventById(id);

    // Check if user is the admin of this event
    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to update this event"
      );
    }

    // Convert date string to Date object if provided
    const { event_date, ...otherUpdateData } = updateData;
    const updatedEventData: Partial<IEvent> = {
      ...otherUpdateData,
    };

    if (event_date) {
      updatedEventData.event_date = new Date(event_date);
    }

    return await EventModel.update(id, updatedEventData);
  }

  static async deleteEvent(id: string, userId: string): Promise<void> {
    const event = await this.getEventById(id);

    // Check if user is the admin of this event
    if (event.admin_id !== userId) {
      throw new ForbiddenError(
        "You don't have permission to delete this event"
      );
    }

    await EventModel.delete(id);
  }

  static async getEventsByAdmin(userId: string): Promise<IEvent[]> {
    return await EventModel.getByAdminId(userId);
  }
}
