import { Request, Response } from "express";
import Event from "../model/event";

const userController = {
  getAllEvent: async (req: Request, res: Response) => {
    try {
      let cat = req.body.cat!;
      let date = req.body.date;
      if (!date) {
        date = new Date();
      }
      if (!cat) {
        cat = { $in: ["test", "testcat"] };
      }
      const filter = {
        startDate: { $gte: date },
        category: cat,
      };
      const event = await Event.find(filter);
      if (!event) {
        return res.status(404).json({
          message: "No Event Found..!",
        });
      }
      return res.status(200).json({
        message: "Events Found..!",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Unable to fetch Events",
        error: error,
      });
    }
  },
  getEvent: async (req: Request, res: Response) => {
    const event_id: string = req.params.id;
    try {
      const event = await Event.findById(event_id);
      if (!event) {
        return res.status(404).json({
          message: "Event Not Found..!",
        });
      }
      return res.status(200).json({
        message: "Event Fetched Sucessfully...!",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Unable to fetch Event",
        error: error,
      });
    }
  },
};

export default userController;
