import { NextFunction, Request, Response } from "express";
import { NotFound } from "../errors/NotFound";
import { HTTP_STATUS_CODES } from "../errors/custom-error";
import Event from "../model/event";
import User from "../model/user";

const adminController = {
  newEvent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventName: string = req.body.event_name;
      const description: string = req.body.description;
      const venue: string = req.body.venue;
      const start_date: Date = req.body.start_date;
      const end_date: Date = req.body.end_date;
      const ticket_price: number = req.body.ticket_price;
      const total_tickets: number = req.body.total_tickets;
      const category: string = req.body.category;
      const event = new Event({
        eventName: eventName,
        description: description,
        venue: venue,
        startDate: start_date,
        endDate: end_date,
        ticketPrice: ticket_price,
        NumberOfTickets: total_tickets,
        category: category,
      });
      const result = await event.save();
      return res.status(200).json({
        success: true,
        message: "Event Saved Sucessfully..!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  updateEvent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event_id: string = req.body.event_id;
      const event = await Event.findById(event_id);
      if (!event) {
        throw new NotFound(
          "Event Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      const eventName: string = req.body.event_name;
      const description: string = req.body.description;
      const venue: string = req.body.venue;
      const start_date: Date = req.body.start_date;
      const end_date: Date = req.body.end_date;
      const ticket_price: number = req.body.ticket_price;
      const total_tickets: number = req.body.total_tickets;
      const category: string = req.body.category;
      event.eventName = eventName;
      event.description = description;
      event.venue = venue;
      event.startDate = start_date;
      event.endDate = end_date;
      event.ticketPrice = ticket_price;
      event.NumberOfTickets = total_tickets;
      event.category = category;
      const result = await event.save();
      return res.status(200).json({
        success: true,
        message: "Event Found..!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteEvent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event_id: string = req.params.id;
      const event = await Event.findById(event_id);
      if (!event) {
        throw new NotFound(
          "Event Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      const result = await Event.findByIdAndDelete(event_id);
      return res.status(200).json({
        success: true,
        message: "Event Deleted..!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  roleChnage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: string = req.body.email;
      const role: string = req.body.role;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new NotFound(
          "User Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      user.role = role;
      const result = await user.save();
      return res.status(200).json({
        success: true,
        message: "User Role Changed..!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;
