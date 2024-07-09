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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const express_validator_1 = require("express-validator");
const authController = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const haspass = yield bcrypt_1.default.hash(password, 12);
            const user = new user_1.default({
                name: name,
                email: email,
                password: haspass,
                role: role,
            });
            const result = yield user.save();
            res.status(200).json({
                message: "User Creaetd",
                id: result._id,
            });
        }
        catch (e) {
            res.status(500).json({
                message: "User not Creaetd",
                error: e,
            });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Validation Errors",
                Error: error.array(),
            });
        }
        try {
            const user = yield user_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User Not Found...!");
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (match) {
                req.session.logged = true;
                req.session.user = user;
                return res.status(200).json({
                    message: "Logged In sucessfully",
                });
            }
            return res.status(401).json({
                message: "Invalid Email or Password",
            });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Error In login",
                error: e,
            });
        }
    }),
};
exports.default = authController;
