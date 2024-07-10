import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: `config.env` });

const isAuth = (req: Request, res: Response, next: NextFunction) => {
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
    const jwt_secret: string = process.env.JWT_SECRET!;
    token = token.split(" ")[1];
    jwt.verify(token, jwt_secret);
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Invalid Token..!",
    });
  }
};

export default isAuth;
