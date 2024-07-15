import User from "../model/user";
import { body } from "express-validator";

export const signupSchema = [
  body("name").notEmpty().withMessage("Please Fill name..!").trim(),
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("Please Enter Valid Email..!")
    .trim()
    .custom((value) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email Exist Already..!");
        }
      });
    })
    .normalizeEmail(),
  body("password", "Please Enter atleast 5 character")
    .notEmpty()
    .isLength({ min: 5 })
    .trim(),
  body("confirm_pass")
    .notEmpty()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Password Mismatched..!");
      }
      return true;
    }),
  body("role", "Please enter Role...!").notEmpty().trim(),
];

export const loginSchema = [
  body("email")
    .isEmail()
    .withMessage("Please Enter Valid Email..!")
    .notEmpty()
    .normalizeEmail(),
  body("password", "Please Enter atleast 5 character")
    .notEmpty()
    .isLength({ min: 5 })
    .trim(),
];

export const eventSchema = [
  body("event_name")
    .notEmpty()
    .trim()
    .withMessage("Please enter event Name..!"),
  body("description")
    .notEmpty()
    .isLength({ min: 20 })
    .trim()
    .withMessage("Please Enter atleast 20 character"),
  body("venue").notEmpty().trim().withMessage("Please enter venue details..!"),
  body("start_date")
    .isISO8601()
    .notEmpty()
    .trim()
    .withMessage("Please enter start date details..!"),
  body("end_date")
    .isISO8601()
    .notEmpty()
    .trim()
    .withMessage("Please enter end date details..!"),
  body("ticket_price")
    .isFloat()
    .notEmpty()
    .trim()
    .withMessage("Please enter ticket price..!"),
  body("total_tickets")
    .isNumeric()
    .notEmpty()
    .trim()
    .withMessage("Please enter total number of ticket..!"),
  body("category").notEmpty().trim().withMessage("Please enter category..!"),
];
export const roleSchema = [
  body("email", "Please Enter Valid Email..!")
    .isEmail()
    .notEmpty()
    .trim()
    .normalizeEmail(),
  body("role", "Please Enter Valid Role..!")
    .notEmpty()
    .isLength({ min: 4 })
    .trim(),
];
export const cartUpdateSchema = [
  body("cart_id", "Please Enter Valid Cart ID (24 Characters)..!")
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric()
    .trim(),
  body("event_id", "Please Enter Valid Event ID (24 Characters)..!")
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric()
    .trim(),
  body("quantity", "Please Enter Quantity..!").notEmpty().isNumeric(),
];

export const cartdeleteSchema = [
  body("cart_id", "Please Enter Valid Cart ID (24 Characters)..!")
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
  body("event_id", "Please Enter Valid Event ID (24 Characters)..!")
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
];

export const saveCartSchema = [
  body("items").custom((value) => {
    if (!Array.isArray(value)) {
      throw new Error("Items must be an array");
    }
    for (const item of value) {
      if (
        item.eventId == undefined ||
        item.quantity == undefined ||
        item.price == undefined
      ) {
        throw new Error(
          "Each item must have properties: eventId, quantity, price"
        );
      }
      console.log(typeof item.eventId);
      console.log(typeof item.quantity);
      console.log(typeof item.price);
      if (
        typeof item.eventId != "string" ||
        typeof item.quantity != "number" ||
        typeof item.price != "number"
      ) {
        throw new Error("Invalid data type for eventId, quantity, or price");
      }
    }
    return true;
  }),
];
