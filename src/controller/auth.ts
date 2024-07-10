import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: `config.env` });
const authController = {
  signup: async (req: Request, res: Response) => {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const role: string = req.body.role;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const haspass = await bcrypt.hash(password, 12);
      const user = new User({
        name: name,
        email: email,
        password: haspass,
        role: role,
      });
      const result = await user.save();
      res.status(200).json({
        message: "User Creaetd",
        id: result._id,
      });
    } catch (e) {
      res.status(500).json({
        message: "User not Creaetd",
        error: e,
      });
    }
  },
  login: async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Validation Errors",
        Error: error.array(),
      });
    }
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User Not Found...!");
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.logged = true;
        req.session.user = {
          id: user._id.toString(),
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
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Error In login",
        error: e,
      });
    }
  },
};

export default authController;
