import { Request, Response } from "express";
import { EventModel } from "./model/event.model";

export class EventController {
  // create a new event
  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const event = await EventModel.createEvent(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // get an event by id
  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const event = await EventModel.getEventById(id);
      if (!event) {
        res.status(404).json({
          success: false,
          message: "Event not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error getting event:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // update an event
  static async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const { id } = req.params;
      const event = await EventModel.updateEvent(id, req.body);
      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // delete an event
  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const { id } = req.params;
      await EventModel.deleteEvent(id);
      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }

  // get all events with optional filtering and pagination
  static async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Permission denied",
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;
      const search = req.query.search as string | undefined;

      const { data, total } = await EventModel.getAllEvents({
        page,
        limit,
        startDate,
        endDate,
        search,
      });

      res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
