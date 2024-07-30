import { NextFunction, Request, Response } from "express";
import { Unauth } from "../errors/Unauthendicate";
import { HTTP_STATUS_CODES } from "../errors/custom-error";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user?.role == "admin") {
    next();
  } else {
    throw new Unauth(
      "Unauthendicate User..!",
      HTTP_STATUS_CODES.UNAUTHORIZED,
      []
    );
  }
};

export default isAdmin;
