"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qrcode_1 = require("qrcode");
const nodemailer_1 = require("nodemailer");
const NotFound_1 = require("../errors/NotFound");
const Forbidden_1 = require("../errors/Forbidden");
const custom_error_1 = require("../errors/custom-error");
const event_1 = __importDefault(require("../model/event"));
const cart_1 = __importDefault(require("../model/cart"));
const order_1 = __importDefault(require("../model/order"));
const userController = {
    getAllEvent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let cat = req.body.cat;
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
            const event = yield event_1.default.find(filter);
            if (!event) {
                throw new NotFound_1.NotFound("No Event Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            return res.status(200).json({
                success: true,
                message: "Events Found..!",
                data: event,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getEvent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const event_id = req.params.id;
        try {
            const event = yield event_1.default.findById(event_id);
            if (!event) {
                throw new NotFound_1.NotFound("Event Not Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            return res.status(200).json({
                success: true,
                message: "Event Fetched Sucessfully...!",
                data: event,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id.toString();
            const cart = yield cart_1.default.findOne({ userId: userId });
            if (!cart) {
                throw new NotFound_1.NotFound("Cart Not Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            return res.status(200).json({
                success: true,
                message: "Cart Fetched Sucessfully...!",
                data: cart,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    postCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const items = req.body.items;
            const event = yield event_1.default.findById(items[0].eventId);
            if (!event) {
                throw new NotFound_1.NotFound("Event Not Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            if (items[0].quantity > (event === null || event === void 0 ? void 0 : event.NumberOfTickets)) {
                throw new Forbidden_1.Forbidden("Ticket count exceeded maximum limit", custom_error_1.HTTP_STATUS_CODES.FORBIDDEN, [{ available_tickets: event === null || event === void 0 ? void 0 : event.NumberOfTickets }]);
            }
            const cart = new cart_1.default({
                userId: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id,
                items: items,
            });
            const result = yield cart.save();
            return res.status(200).json({
                success: true,
                message: "Cart Added Sucessfully...!",
                data: {},
                cart_id: result._id,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    updateCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.body.cart_id;
            const eventId = req.body.event_id;
            const quantity = req.body.quantity;
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                throw new NotFound_1.NotFound("Cart Not Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            const event = yield event_1.default.findById(eventId);
            if (!event) {
                throw new NotFound_1.NotFound("The Event Not Found in Cart...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            if (quantity > (event === null || event === void 0 ? void 0 : event.NumberOfTickets)) {
                throw new Forbidden_1.Forbidden("Ticket count exceeded maximum limit", custom_error_1.HTTP_STATUS_CODES.FORBIDDEN, [{ available_tickets: event === null || event === void 0 ? void 0 : event.NumberOfTickets }]);
            }
            const indexToUpdate = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => eventId === item.eventId.toString());
            if (indexToUpdate != -1) {
                cart.items[indexToUpdate].quantity = quantity;
                const result = yield cart.save();
                return res.status(200).json({
                    success: true,
                    message: "Item Updated Sucessfully...!",
                    data: result,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }),
    deleteCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cartId = req.body.cart_id;
            const eventId = req.body.event_id;
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                throw new NotFound_1.NotFound("Cart Not Found...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            const indexToDelete = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => eventId === item.eventId.toString());
            if (indexToDelete != -1) {
                cart.items.splice(indexToDelete, 1);
                const result = yield cart.save();
                return res.status(200).json({
                    success: true,
                    message: "Item Deleted Sucessfully...!",
                    data: result,
                });
            }
            else {
                throw new NotFound_1.NotFound("The Event Not Found in Cart...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
        }
        catch (error) {
            next(error);
        }
    }),
    putOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const status = req.body.status;
            const method = req.body.method;
            const cartId = req.body.cart_id;
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                throw new NotFound_1.NotFound("Cart Not Found...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            const items = cart.items;
            const order = new order_1.default({
                userId: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id,
                items: items,
                orderStatus: status,
                totalAmount: items[0].quantity * items[0].price,
                paymentMethod: method,
            });
            const result = yield order.save();
            const event = yield event_1.default.findById(items[0].eventId);
            if (event != null &&
                event !== undefined &&
                (event === null || event === void 0 ? void 0 : event.NumberOfTickets) != null) {
                event.NumberOfTickets = (event === null || event === void 0 ? void 0 : event.NumberOfTickets) - items[0].quantity;
            }
            yield (event === null || event === void 0 ? void 0 : event.save());
            yield cart_1.default.findByIdAndDelete(cartId);
            const eventData = result._id +
                ", " +
                (event === null || event === void 0 ? void 0 : event.eventName) +
                ", " +
                (event === null || event === void 0 ? void 0 : event.venue) +
                ", " +
                result.items[0].quantity +
                ", " +
                (event === null || event === void 0 ? void 0 : event.startDate.toLocaleDateString()) +
                " " +
                (event === null || event === void 0 ? void 0 : event.startDate.toLocaleTimeString());
            console.log(eventData);
            let qrCode = yield (0, qrcode_1.toDataURL)(JSON.stringify(eventData));
            qrCode = qrCode.replace(/\\/g, "");
            const mailOptions = {
                from: "velu32351@gmail.com",
                to: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.email,
                subject: "Order Placed Successfully",
                html: `<!DOCTYPE html>
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
                    ((_c = req.session.user) === null || _c === void 0 ? void 0 : _c.name) +
                    `,</p>
        <p>We are excited to invite you to the following event:</p>
        <table class="event-details">
            <tr>
                <th>Event Name</th>
                <td>` +
                    (event === null || event === void 0 ? void 0 : event.eventName) +
                    `</td>
            </tr>
            <tr>
                <th>Venue</th>
                <td>` +
                    (event === null || event === void 0 ? void 0 : event.venue) +
                    `</td>
            </tr>
            <tr>
                <th>Start Date & Time</th>
                <td>` +
                    (event === null || event === void 0 ? void 0 : event.startDate.toLocaleDateString()) +
                    " " +
                    (event === null || event === void 0 ? void 0 : event.startDate.toLocaleTimeString()) +
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
                    to: (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.email,
                },
            };
            //Send the email
            const transport = (0, nodemailer_1.createTransport)({
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
                }
                else {
                    console.log("Email sent:", info.response);
                }
            });
            return res.status(200).json({
                success: true,
                message: "Order Placed Sucessfully...!",
                data: {},
                orderId: result._id,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orderId = req.params.id;
            const result = yield order_1.default.findById(orderId);
            if (!result) {
                throw new NotFound_1.NotFound("Order Not Found...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            const event = yield event_1.default.findById(result.items[0].eventId);
            const eventData = orderId +
                ", " +
                (event === null || event === void 0 ? void 0 : event.eventName) +
                ", " +
                (event === null || event === void 0 ? void 0 : event.venue) +
                ", " +
                result.items[0].quantity +
                ", " +
                (event === null || event === void 0 ? void 0 : event.startDate.toLocaleDateString()) +
                " " +
                (event === null || event === void 0 ? void 0 : event.startDate.toLocaleTimeString());
            console.log(eventData);
            let qrCode = yield (0, qrcode_1.toDataURL)(JSON.stringify(eventData));
            qrCode = qrCode.replace(/\\/g, "");
            return res.status(200).json({
                success: true,
                message: "Order Fetched Sucessfully...!",
                data: result,
                qrcode: `<img src="${qrCode}" alt="Event QR Code">`,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    cancelOrder: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const orderId = req.body.order_id;
        try {
            const order = yield order_1.default.findById(orderId);
            if (!order) {
                throw new NotFound_1.NotFound("Order Not Found...!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            order.orderStatus = "Canceled";
            yield order.save();
            return res.status(200).json({
                success: true,
                message: "Order Canceled Sucessfully...!",
                data: {},
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = userController;
//# sourceMappingURL=user.js.map