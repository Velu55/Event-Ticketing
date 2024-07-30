import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Unauth } from "../errors/Unauthendicate";
import { HTTP_STATUS_CODES } from "../errors/custom-error";
dotenv.config({ path: `config.env` });

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.header("Authorization");
  if (!token) {
    throw new Unauth("Access denied..!", HTTP_STATUS_CODES.UNAUTHORIZED, []);
  }
  if (!req.session.logged) {
    throw new Unauth("Unauthenticated...!", HTTP_STATUS_CODES.UNAUTHORIZED, []);
  }
  try {
    const jwt_secret: string = process.env.JWT_SECRET!;
    token = token.split(" ")[1];
    jwt.verify(token, jwt_secret, (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new Unauth(
            "Token has expired...!",
            HTTP_STATUS_CODES.UNAUTHORIZED,
            err
          );
        } else if (err.name === "JsonWebTokenError") {
          throw new Unauth(
            "Invalid token...!",
            HTTP_STATUS_CODES.UNAUTHORIZED,
            err
          );
        } else {
          throw new Unauth(
            "Token verification error...!",
            HTTP_STATUS_CODES.UNAUTHORIZED,
            err
          );
        }
      }
      console.log(decode);
    });
    next();
  } catch (e) {
    next(e);
  }
};

export default isAuth;
