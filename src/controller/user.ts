import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Event from "../model/event";
import Cart from "../model/cart";

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
  getCart: async (req: Request, res: Response) => {
    try {
      const userId = req.session.user?.id.toString();
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) {
        return res.status(404).json({
          message: "Cart Not Found..!",
        });
      }
      return res.status(200).json({
        message: "Cart Fetched Sucessfully...!",
        data: cart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable To Fetch Cart..!",
        error: error,
      });
    }
  },
  postCart: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    const items = req.body.items;
    try {
      const cart = new Cart({
        userId: req.session.user?.id,
        items: items,
      });
      const result = await cart.save();
      return res.status(200).json({
        message: "Cart Added Sucessfully...!",
        cart_id: result._id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Unable to Save cart",
        error: error,
      });
    }
  },
  updateCart: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const cartId = req.body.cart_id;
      const eventId = req.body.event_id;
      const quantity = req.body.quantity;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({
          message: "Cart Not Found...!",
        });
      }
      const indexToUpdate = cart?.items.findIndex(
        (item) => eventId === item.eventId.toString()
      );
      if (indexToUpdate != -1) {
        cart.items[indexToUpdate].quantity = quantity;
        const result = await cart.save();
        return res.status(200).json({
          message: "Item Updated Sucessfully...!",
          data: result,
        });
      } else {
        return res.status(404).json({
          message: "The Event Not Found in Cart...!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable to Update Item",
        error: error,
      });
    }
  },
  deleteCart: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const cartId = req.body.cart_id;
      const eventId = req.body.event_id;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({
          message: "Cart Not Found...!",
        });
      }
      const indexToDelete = cart?.items.findIndex(
        (item) => eventId === item.eventId.toString()
      );
      if (indexToDelete != -1) {
        cart.items.splice(indexToDelete, 1);
        const result = await cart.save();
        return res.status(200).json({
          message: "Item Deleted Sucessfully...!",
          data: result,
        });
      } else {
        return res.status(404).json({
          message: "The Event Not Found in Cart...!",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable to Delete Item",
        error: error,
      });
    }
  },
};

export default userController;
