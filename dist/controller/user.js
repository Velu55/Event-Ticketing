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
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import sendgrid from "nodemailer-sendgrid-transport";
const event_1 = __importDefault(require("../model/event"));
const cart_1 = __importDefault(require("../model/cart"));
const order_1 = __importDefault(require("../model/order"));
const userController = {
    getAllEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                return res.status(404).json({
                    message: "No Event Found..!",
                });
            }
            return res.status(200).json({
                message: "Events Found..!",
                data: event,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Unable to fetch Events",
                error: error,
            });
        }
    }),
    getEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const event_id = req.params.id;
        try {
            const event = yield event_1.default.findById(event_id);
            if (!event) {
                return res.status(404).json({
                    message: "Event Not Found..!",
                });
            }
            return res.status(200).json({
                message: "Event Fetched Sucessfully...!",
                data: event,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Unable to fetch Event",
                error: error,
            });
        }
    }),
    getCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id.toString();
            const cart = yield cart_1.default.findOne({ userId: userId });
            if (!cart) {
                return res.status(404).json({
                    message: "Cart Not Found..!",
                });
            }
            return res.status(200).json({
                message: "Cart Fetched Sucessfully...!",
                data: cart,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable To Fetch Cart..!",
                error: error,
            });
        }
    }),
    postCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        const items = req.body.items;
        try {
            const event = yield event_1.default.findById(items[0].eventId);
            if (!event) {
                return res.status(404).json({
                    message: "Event Not Found..!",
                });
            }
            if (items[0].quantity > (event === null || event === void 0 ? void 0 : event.NumberOfTickets)) {
                return res.status(403).json({
                    message: "Ticket count exceeded maximum limit",
                    available_tickets: event === null || event === void 0 ? void 0 : event.NumberOfTickets,
                });
            }
            const cart = new cart_1.default({
                userId: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id,
                items: items,
            });
            const result = yield cart.save();
            return res.status(200).json({
                message: "Cart Added Sucessfully...!",
                cart_id: result._id,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Unable to Save cart",
                error: error,
            });
        }
    }),
    updateCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
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
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                return res.status(404).json({
                    message: "Cart Not Found...!",
                });
            }
            const event = yield event_1.default.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    message: "The Event Not Found in Cart...!",
                });
            }
            if (quantity > (event === null || event === void 0 ? void 0 : event.NumberOfTickets)) {
                return res.status(403).json({
                    message: "Ticket count exceeded maximum limit",
                    available_tickets: event === null || event === void 0 ? void 0 : event.NumberOfTickets,
                });
            }
            const indexToUpdate = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => eventId === item.eventId.toString());
            if (indexToUpdate != -1) {
                cart.items[indexToUpdate].quantity = quantity;
                const result = yield cart.save();
                return res.status(200).json({
                    message: "Item Updated Sucessfully...!",
                    data: result,
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable to Update Item",
                error: error,
            });
        }
    }),
    deleteCart: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const cartId = req.body.cart_id;
            const eventId = req.body.event_id;
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                return res.status(404).json({
                    message: "Cart Not Found...!",
                });
            }
            const indexToDelete = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => eventId === item.eventId.toString());
            if (indexToDelete != -1) {
                cart.items.splice(indexToDelete, 1);
                const result = yield cart.save();
                return res.status(200).json({
                    message: "Item Deleted Sucessfully...!",
                    data: result,
                });
            }
            else {
                return res.status(404).json({
                    message: "The Event Not Found in Cart...!",
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable to Delete Item",
                error: error,
            });
        }
    }),
    putOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const error = (0, express_validator_1.validationResult)(req);
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
            const cart = yield cart_1.default.findById(cartId);
            if (!cart) {
                return res.status(404).json({
                    message: "Cart Not Found...!",
                });
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
            const transport = nodemailer_1.default.createTransport({
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
                message: "Order Placed Sucessfully...!",
                orderId: result._id,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable to Place Order..!",
                error: error,
            });
        }
    }),
    getOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orderId = req.params.id;
            const result = yield order_1.default.findById(orderId);
            if (!result) {
                return res.status(404).json({
                    message: "Order Not Found...!",
                });
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
                message: "Order Fetched Sucessfully...!",
                data: result,
                qrcode: `<img src="${qrCode}" alt="Event QR Code">`,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable to Place Order..!",
                error: error,
            });
        }
    }),
    cancelOrder: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const orderId = req.body.order_id;
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const order = yield order_1.default.findById(orderId);
            if (!order) {
                return res.status(404).json({
                    message: "Order Not Found...!",
                });
            }
            order.orderStatus = "Canceled";
            yield order.save();
            return res.status(200).json({
                message: "Order Canceled Sucessfully...!",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Unable to Cancel the  Order..!",
                error: error,
            });
        }
    }),
};
exports.default = userController;
