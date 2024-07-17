import { Request, Response } from "express";
import { toDataURL } from "qrcode";
import { validationResult } from "express-validator";
import Event from "../model/event";
import Cart from "../model/cart";
import Order from "../model/order";

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
        // NumberOfTickets: { $gt: 0 },
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
      const event = await Event.findById(items[0].eventId);
      if (!event) {
        return res.status(404).json({
          message: "Event Not Found..!",
        });
      }
      if (items[0].quantity > event?.NumberOfTickets) {
        return res.status(403).json({
          message: "Ticket count exceeded maximum limit",
          available_tickets: event?.NumberOfTickets,
        });
      }
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
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          message: "The Event Not Found in Cart...!",
        });
      }
      if (quantity > event?.NumberOfTickets) {
        return res.status(403).json({
          message: "Ticket count exceeded maximum limit",
          available_tickets: event?.NumberOfTickets,
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
  putOrder: async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const status = req.body.status;
      const method = req.body.method;
      const cartId = req.body.cart_id;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({
          message: "Cart Not Found...!",
        });
      }
      const items = cart.items;
      const order = new Order({
        userId: req.session.user?.id,
        items: items,
        orderStatus: status,
        totalAmount: items[0].quantity * items[0].price,
        paymentMethod: method,
      });
      const result = await order.save();
      const event = await Event.findById(items[0].eventId);
      if (
        event != null &&
        event !== undefined &&
        event?.NumberOfTickets != null
      ) {
        event!.NumberOfTickets = event?.NumberOfTickets - items[0].quantity;
      }
      await event?.save();
      await Cart.findByIdAndDelete(cartId);
      return res.status(200).json({
        message: "Order Placed Sucessfully...!",
        orderId: result._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable to Place Order..!",
        error: error,
      });
    }
  },
  getOrder: async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const result = await Order.findById(orderId);
      if (!result) {
        return res.status(404).json({
          message: "Order Not Found...!",
        });
      }
      const event = await Event.findById(result.items[0].eventId);
      const eventData =
        orderId +
        ", " +
        event?.eventName +
        ", " +
        event?.venue +
        ", " +
        result.items[0].quantity +
        ", " +
        event?.startDate.toLocaleDateString() +
        " " +
        event?.startDate.toLocaleTimeString();
      console.log(eventData);
      const qrCode = await toDataURL(JSON.stringify(eventData));
      return res.status(200).json({
        message: "Order Fetched Sucessfully...!",
        data: result,
        qrcode: `<img src="${qrCode}" alt="Event QR Code">`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Unable to Place Order..!",
        error: error,
      });
    }
  },
};

export default userController;
