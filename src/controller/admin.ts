import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Event from "../model/event";

const adminController = {
  newEvent: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
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
        message: "event saved sucessfully..!",
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Event not Creaetd",
        error: error,
      });
    }
  },
  updateEvent: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const event_id: string = req.body.event_id;
      const event = await Event.findById(event_id);
      if (!event) {
        return res.status(404).json({
          message: "event not found..!",
        });
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
        message: "event  found..!",
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Event not Updated..!",
        error: error,
      });
    }
  },
  deleteEvent: async (req: Request, res: Response) => {
    try {
      const event_id: string = req.params.id;
      const event = await Event.findById(event_id);
      if (!event) {
        return res.status(404).json({
          message: "Event Not Found..!",
        });
      }
      const result = await Event.findByIdAndDelete(event_id);
      return res.status(200).json({
        message: "Event Deleted..!",
        result: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Event not Deleted..!",
        error: error,
      });
    }
  },
};

export default adminController;
