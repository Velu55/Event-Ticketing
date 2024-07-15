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
const cart_1 = __importDefault(require("../model/cart"));
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
            const indexToUpdate = cart === null || cart === void 0 ? void 0 : cart.items.findIndex((item) => eventId === item.eventId.toString());
            if (indexToUpdate != -1) {
                cart.items[indexToUpdate].quantity = quantity;
                const result = yield cart.save();
                return res.status(200).json({
                    message: "Item Updated Sucessfully...!",
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
};
exports.default = userController;
