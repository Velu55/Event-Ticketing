"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCartSchema = exports.cartdeleteSchema = exports.cartUpdateSchema = exports.roleSchema = exports.eventSchema = exports.loginSchema = exports.signupSchema = void 0;
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
exports.signupSchema = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Please Fill name..!").trim(),
    (0, express_validator_1.body)("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please Enter Valid Email..!")
        .trim()
        .custom((value) => {
        return user_1.default.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject("Email Exist Already..!");
            }
        });
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password", "Please Enter atleast 5 character")
        .notEmpty()
        .isLength({ min: 5 })
        .trim(),
    (0, express_validator_1.body)("confirm_pass")
        .notEmpty()
        .custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error("Password Mismatched..!");
        }
        return true;
    }),
    (0, express_validator_1.body)("role", "Please enter Role...!").notEmpty().trim(),
];
exports.loginSchema = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please Enter Valid Email..!")
        .notEmpty()
        .normalizeEmail(),
    (0, express_validator_1.body)("password", "Please Enter atleast 5 character")
        .notEmpty()
        .isLength({ min: 5 })
        .trim(),
];
exports.eventSchema = [
    (0, express_validator_1.body)("event_name")
        .notEmpty()
        .trim()
        .withMessage("Please enter event Name..!"),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .isLength({ min: 20 })
        .trim()
        .withMessage("Please Enter atleast 20 character"),
    (0, express_validator_1.body)("venue").notEmpty().trim().withMessage("Please enter venue details..!"),
    (0, express_validator_1.body)("start_date")
        .isISO8601()
        .notEmpty()
        .trim()
        .withMessage("Please enter start date details..!"),
    (0, express_validator_1.body)("end_date")
        .isISO8601()
        .notEmpty()
        .trim()
        .withMessage("Please enter end date details..!"),
    (0, express_validator_1.body)("ticket_price")
        .isFloat()
        .notEmpty()
        .trim()
        .withMessage("Please enter ticket price..!"),
    (0, express_validator_1.body)("total_tickets")
        .isNumeric()
        .notEmpty()
        .trim()
        .withMessage("Please enter total number of ticket..!"),
    (0, express_validator_1.body)("category").notEmpty().trim().withMessage("Please enter category..!"),
];
exports.roleSchema = [
    (0, express_validator_1.body)("email", "Please Enter Valid Email..!")
        .isEmail()
        .notEmpty()
        .trim()
        .normalizeEmail(),
    (0, express_validator_1.body)("role", "Please Enter Valid Role..!")
        .notEmpty()
        .isLength({ min: 4 })
        .trim(),
];
exports.cartUpdateSchema = [
    (0, express_validator_1.body)("cart_id", "Please Enter Valid Cart ID (24 Characters)..!")
        .notEmpty()
        .isLength({ min: 24, max: 24 })
        .isAlphanumeric()
        .trim(),
    (0, express_validator_1.body)("event_id", "Please Enter Valid Event ID (24 Characters)..!")
        .notEmpty()
        .isLength({ min: 24, max: 24 })
        .isAlphanumeric()
        .trim(),
    (0, express_validator_1.body)("quantity", "Please Enter Quantity..!").notEmpty().isNumeric(),
];
exports.cartdeleteSchema = [
    (0, express_validator_1.body)("cart_id", "Please Enter Valid Cart ID (24 Characters)..!")
        .notEmpty()
        .isLength({ min: 24, max: 24 })
        .isAlphanumeric(),
    (0, express_validator_1.body)("event_id", "Please Enter Valid Event ID (24 Characters)..!")
        .notEmpty()
        .isLength({ min: 24, max: 24 })
        .isAlphanumeric(),
];
exports.saveCartSchema = [
    (0, express_validator_1.body)("items").custom((value) => {
        if (!Array.isArray(value)) {
            throw new Error("Items must be an array");
        }
        for (const item of value) {
            if (item.eventId == undefined ||
                item.quantity == undefined ||
                item.price == undefined) {
                throw new Error("Each item must have properties: eventId, quantity, price");
            }
            console.log(typeof item.eventId);
            console.log(typeof item.quantity);
            console.log(typeof item.price);
            if (typeof item.eventId != "string" ||
                typeof item.quantity != "number" ||
                typeof item.price != "number") {
                throw new Error("Invalid data type for eventId, quantity, or price");
            }
        }
        return true;
    }),
];
