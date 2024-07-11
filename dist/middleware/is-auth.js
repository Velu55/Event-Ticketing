"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `config.env` });
const isAuth = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({
            error: "Access denied..!",
        });
    }
    if (!req.session.logged) {
        return res.status(401).json({
            error: "unauthenticated",
        });
    }
    try {
        const jwt_secret = process.env.JWT_SECRET;
        token = token.split(" ")[1];
        jsonwebtoken_1.default.verify(token, jwt_secret);
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            error: "Invalid Token..!",
        });
    }
};
exports.default = isAuth;
