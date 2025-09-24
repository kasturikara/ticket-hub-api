import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import {
  ICreateEventRequest,
  IEventQueryParams,
  IUpdateEventRequest,
} from "../interfaces/event.interfaces";
import { BadRequestError } from "../utils/errors";
import { catchAsync } from "../middleware/error.handler";

export class EventController {
  // Event endpoints
  static createEvent = catchAsync(async (req: Request, res: Response) => {
    const eventData: ICreateEventRequest = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!eventData.title || !eventData.event_date || !eventData.location) {
      throw new BadRequestError("Missing required event information");
    }

    const event = await EventService.createEvent(eventData, userId);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  });

  static getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const queryParams: IEventQueryParams = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      location: req.query.location as string,
      admin_id: req.query.admin_id as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    const { events, total } = await EventService.getAllEvents(queryParams);

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: {
        events,
        pagination: {
          total,
          limit: queryParams.limit || 10,
          offset: queryParams.offset || 0,
        },
      },
    });
  });

  static getEventById = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const event = await EventService.getEventById(eventId);

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  });

  static updateEvent = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const updateData: IUpdateEventRequest = req.body;
    const userId = req.user.id;

    const updatedEvent = await EventService.updateEvent(
      eventId,
      updateData,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  });

  static deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    await EventService.deleteEvent(eventId, userId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  });

  static getMyEvents = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const events = await EventService.getEventsByAdmin(userId);

    res.status(200).json({
      success: true,
      message: "User events retrieved successfully",
      data: events,
    });
  });
}
