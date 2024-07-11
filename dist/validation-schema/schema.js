"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = exports.eventSchema = exports.loginSchema = exports.signupSchema = void 0;
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
        .notEmpty()
        .withMessage("Please Enter Valid Email..!")
        .trim()
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
    (0, express_validator_1.body)("email")
        .isEmail()
        .notEmpty()
        .withMessage("Please Enter Valid Email..!")
        .trim()
        .normalizeEmail(),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .isLength({ min: 4 })
        .trim()
        .withMessage("Please Enter Valid Role..!"),
];
