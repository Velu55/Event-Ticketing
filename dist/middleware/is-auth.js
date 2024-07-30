"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Unauthendicate_1 = require("../errors/Unauthendicate");
const custom_error_1 = require("../errors/custom-error");
dotenv_1.default.config({ path: `config.env` });
const isAuth = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        throw new Unauthendicate_1.Unauth("Access denied..!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, []);
    }
    if (!req.session.logged) {
        throw new Unauthendicate_1.Unauth("Unauthenticated...!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, []);
    }
    try {
        const jwt_secret = process.env.JWT_SECRET;
        token = token.split(" ")[1];
        jsonwebtoken_1.default.verify(token, jwt_secret, (err, decode) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new Unauthendicate_1.Unauth("Token has expired...!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, err);
                }
                else if (err.name === "JsonWebTokenError") {
                    throw new Unauthendicate_1.Unauth("Invalid token...!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, err);
                }
                else {
                    throw new Unauthendicate_1.Unauth("Token verification error...!", custom_error_1.HTTP_STATUS_CODES.UNAUTHORIZED, err);
                }
            }
            console.log(decode);
        });
        next();
    }
    catch (e) {
        next(e);
    }
};
exports.default = isAuth;
//# sourceMappingURL=is-auth.js.map