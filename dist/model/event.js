"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
    NumberOfTickets: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Event", eventSchema);
//# sourceMappingURL=event.js.map