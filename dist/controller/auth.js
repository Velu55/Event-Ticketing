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
const custom_error_1 = require("../errors/custom-error");
const NotFound_1 = require("../errors/NotFound");
const Unauthendicate_1 = require("../errors/Unauthendicate");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `config.env` });
const authController = {
    signup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const haspass = yield bcrypt_1.default.hash(password, 12);
            const user = new user_1.default({
                name: name,
                email: email,
                password: haspass,
                role: "user",
            });
            const result = yield user.save();
            res.status(200).json({
                success: true,
                message: "User Creaetd",
                data: {},
                id: result._id,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = yield user_1.default.findOne({ email: email });
            if (!user) {
                throw new NotFound_1.NotFound("User Not Found..!", custom_error_1.HTTP_STATUS_CODES.NOT_FOUND, []);
            }
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (match) {
                req.session.logged = true;
                req.session.user = {
                    name: user.name,
                    id: user._id,
                    role: user.role,
                    email: user.email,
                };
                const secret = process.env.JWT_SECRET;
                const exp = process.env.JWT_EXPIRY;
                const token = jsonwebtoken_1.default.sign({
                    email: email,
                    id: user._id.toString(),
                }, secret, { expiresIn: exp });
                return res.status(200).json({
                    success: true,
                    message: "Logged In sucessfully",
                    data: {},
                    token: token,
                    id: user._id.toString(),
                });
            }
            throw new Unauthendicate_1.Unauth("Invalid Email or Password...!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = authController;
//# sourceMappingURL=auth.js.map