import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import { validationResult } from "express-validator";
import { HTTP_STATUS_CODES } from "../errors/custom-error";
import { BadRequests } from "../errors/BadRequestError";
import { NotFound } from "../errors/NotFound";
import { Unauth } from "../errors/Unauthendicate";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: `config.env` });
const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name: string = req.body.name;
      const email: string = req.body.email;
      const password: string = req.body.password;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        throw new BadRequests(
          "Validation Error",
          HTTP_STATUS_CODES.BAD_REQUEST,
          error
        );
      }
      const haspass = await bcrypt.hash(password, 12);
      const user = new User({
        name: name,
        email: email,
        password: haspass,
        role: "user",
      });
      const result = await user.save();
      res.status(200).json({
        message: "User Creaetd",
        id: result._id,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        throw new BadRequests(
          "Validation Error",
          HTTP_STATUS_CODES.BAD_REQUEST,
          error
        );
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new NotFound(
          "User Not Found..!",
          HTTP_STATUS_CODES.NOT_FOUND,
          []
        );
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.logged = true;
        req.session.user = {
          name: user.name,
          id: user._id,
          role: user.role,
          email: user.email,
        };
        const secret: string = process.env.JWT_SECRET!;
        const exp: string = process.env.JWT_EXPIRY!;
        const token: string = jwt.sign(
          {
            email: email,
            id: user._id.toString(),
          },
          secret,
          { expiresIn: exp }
        );
        return res.status(200).json({
          message: "Logged In sucessfully",
          token: token,
          id: user._id.toString(),
        });
      }
      throw new Unauth(
        "Invalid Email or Password...!",
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
