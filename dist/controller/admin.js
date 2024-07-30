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
const express_validator_1 = require("express-validator");
const event_1 = __importDefault(require("../model/event"));
const user_1 = __importDefault(require("../model/user"));
const adminController = {
    newEvent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const eventName = req.body.event_name;
            const description = req.body.description;
            const venue = req.body.venue;
            const start_date = req.body.start_date;
            const end_date = req.body.end_date;
            const ticket_price = req.body.ticket_price;
            const total_tickets = req.body.total_tickets;
            const category = req.body.category;
            const event = new event_1.default({
                eventName: eventName,
                description: description,
                venue: venue,
                startDate: start_date,
                endDate: end_date,
                ticketPrice: ticket_price,
                NumberOfTickets: total_tickets,
                category: category,
            });
            const result = yield event.save();
            return res.status(200).json({
                message: "event saved sucessfully..!",
                result: result,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    updateEvent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const event_id = req.body.event_id;
            const event = yield event_1.default.findById(event_id);
            if (!event) {
                return res.status(404).json({
                    message: "event not found..!",
                });
            }
            const eventName = req.body.event_name;
            const description = req.body.description;
            const venue = req.body.venue;
            const start_date = req.body.start_date;
            const end_date = req.body.end_date;
            const ticket_price = req.body.ticket_price;
            const total_tickets = req.body.total_tickets;
            const category = req.body.category;
            event.eventName = eventName;
            event.description = description;
            event.venue = venue;
            event.startDate = start_date;
            event.endDate = end_date;
            event.ticketPrice = ticket_price;
            event.NumberOfTickets = total_tickets;
            event.category = category;
            const result = yield event.save();
            return res.status(200).json({
                message: "event  found..!",
                result: result,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    deleteEvent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const event_id = req.params.id;
            const event = yield event_1.default.findById(event_id);
            if (!event) {
                return res.status(404).json({
                    message: "Event Not Found..!",
                });
            }
            const result = yield event_1.default.findByIdAndDelete(event_id);
            return res.status(200).json({
                message: "Event Deleted..!",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    roleChnage: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const role = req.body.role;
            const user = yield user_1.default.findOne({ email: email });
            if (!user) {
                return res.status(404).json({
                    message: "User Not Found..!",
                });
            }
            user.role = role;
            const result = yield user.save();
            return res.status(200).json({
                message: "User Role Changed..!",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = adminController;
//# sourceMappingURL=admin.js.map