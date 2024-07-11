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
const event_1 = __importDefault(require("../model/event"));
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
};
exports.default = userController;
