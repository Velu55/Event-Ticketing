import { Request, Response, NextFunction } from "express";
import { toDataURL } from "qrcode";
import { createTransport } from "nodemailer";
import { NotFound } from "../errors/NotFound";
import { Forbidden } from "../errors/Forbidden";
import { HTTP_STATUS_CODES } from "../errors/custom-error";
import Event from "../model/event";
import Cart from "../model/cart";
import Order from "../model/order";

const userController = {
  getAllEvent: async (req: Request, res: Response, next: NextFunction) => {
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
        throw new NotFound(
          "No Event Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      return res.status(200).json({
        success: true,
        message: "Events Found..!",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },
  getEvent: async (req: Request, res: Response, next: NextFunction) => {
    const event_id: string = req.params.id;
    try {
      const event = await Event.findById(event_id);
      if (!event) {
        throw new NotFound(
          "Event Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      return res.status(200).json({
        success: true,
        message: "Event Fetched Sucessfully...!",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },
  getCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user?.id.toString();
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) {
        throw new NotFound(
          "Cart Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      return res.status(200).json({
        success: true,
        message: "Cart Fetched Sucessfully...!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  },
  postCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = req.body.items;
      const event = await Event.findById(items[0].eventId);
      if (!event) {
        throw new NotFound(
          "Event Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      if (items[0].quantity > event?.NumberOfTickets) {
        throw new Forbidden(
          "Ticket count exceeded maximum limit",
          HTTP_STATUS_CODES.FORBIDDEN,
          [{ available_tickets: event?.NumberOfTickets }]
        );
      }
      const cart = new Cart({
        userId: req.session.user?.id,
        items: items,
      });
      const result = await cart.save();
      return res.status(200).json({
        success: true,
        message: "Cart Added Sucessfully...!",
        data: {},
        cart_id: result._id,
      });
    } catch (error) {
      next(error);
    }
  },
  updateCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartId = req.body.cart_id;
      const eventId = req.body.event_id;
      const quantity = req.body.quantity;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new NotFound(
          "Cart Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      const event = await Event.findById(eventId);
      if (!event) {
        throw new NotFound(
          "The Event Not Found in Cart...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      if (quantity > event?.NumberOfTickets) {
        throw new Forbidden(
          "Ticket count exceeded maximum limit",
          HTTP_STATUS_CODES.FORBIDDEN,
          [{ available_tickets: event?.NumberOfTickets }]
        );
      }
      const indexToUpdate = cart?.items.findIndex(
        (item) => eventId === item.eventId.toString()
      );
      if (indexToUpdate != -1) {
        cart.items[indexToUpdate].quantity = quantity;
        const result = await cart.save();
        return res.status(200).json({
          success: true,
          message: "Item Updated Sucessfully...!",
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartId = req.body.cart_id;
      const eventId = req.body.event_id;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new NotFound(
          "Cart Not Found...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      const indexToDelete = cart?.items.findIndex(
        (item) => eventId === item.eventId.toString()
      );
      if (indexToDelete != -1) {
        cart.items.splice(indexToDelete, 1);
        const result = await cart.save();
        return res.status(200).json({
          success: true,
          message: "Item Deleted Sucessfully...!",
          data: result,
        });
      } else {
        throw new NotFound(
          "The Event Not Found in Cart...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
    } catch (error) {
      next(error);
    }
  },
  putOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.body.status;
      const method = req.body.method;
      const cartId = req.body.cart_id;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new NotFound(
          "Cart Not Found...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
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
      const eventData =
        result._id +
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
      let qrCode = await toDataURL(JSON.stringify(eventData));
      qrCode = qrCode.replace(/\\/g, "");
      const mailOptions = {
        from: "velu32351@gmail.com",
        to: req.session.user?.email,
        subject: "Order Placed Successfully",
        html:
          `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Details Email with QR Code</title>
    <style>
        /* Inline CSS for email styling */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333333;
            font-size: 24px;
        }
        p {
            margin-bottom: 20px;
        }
        .event-details {
            margin-top: 20px;
            border-collapse: collapse;
            width: 100%;
        }
        .event-details td, .event-details th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        .qr-code {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Event Details</h1>
        <p>Hello ` +
          req.session.user?.name +
          `,</p>
        <p>We are excited to invite you to the following event:</p>
        <table class="event-details">
            <tr>
                <th>Event Name</th>
                <td>` +
          event?.eventName +
          `</td>
            </tr>
            <tr>
                <th>Venue</th>
                <td>` +
          event?.venue +
          `</td>
            </tr>
            <tr>
                <th>Start Date & Time</th>
                <td>` +
          event?.startDate.toLocaleDateString() +
          " " +
          event?.startDate.toLocaleTimeString() +
          `</td>
            </tr>
            <tr>
                <th>Number of Tickets</th>
                <td>` +
          items[0].quantity +
          `</td>
            </tr>
            <tr>
                <th>Total Ticket Price </th>
                <td>$` +
          items[0].quantity * items[0].price +
          `</td>
            </tr>
        </table>
        <div class="qr-code">
           <img src="${qrCode}" alt="Event QR Code">
        </div>
        <p>Please scan the QR code above for more details and to confirm your attendance.</p>
        <p>Thank you and we look forward to seeing you at the event!</p>`,
        envelope: {
          from: "Order Placed <velu32351@gmail.com>",
          to: req.session.user?.email,
        },
      };
      //Send the email
      const transport = createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: "7677d3001@smtp-brevo.com",
          pass: "sgc0AVUTW8rZ6Qha",
        },
      });
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      return res.status(200).json({
        success: true,
        message: "Order Placed Sucessfully...!",
        data: {},
        orderId: result._id,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id;
      const result = await Order.findById(orderId);
      if (!result) {
        throw new NotFound(
          "Order Not Found...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
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
      let qrCode = await toDataURL(JSON.stringify(eventData));
      qrCode = qrCode.replace(/\\/g, "");
      return res.status(200).json({
        success: true,
        message: "Order Fetched Sucessfully...!",
        data: result,
        qrcode: `<img src="${qrCode}" alt="Event QR Code">`,
      });
    } catch (error) {
      next(error);
    }
  },
  cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.body.order_id;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new NotFound(
          "Order Not Found...!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      order.orderStatus = "Canceled";
      await order.save();
      return res.status(200).json({
        success: true,
        message: "Order Canceled Sucessfully...!",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
