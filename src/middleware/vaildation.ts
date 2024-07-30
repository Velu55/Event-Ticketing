import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequests } from "../errors/BadRequestError";
import { HTTP_STATUS_CODES } from "../errors/custom-error";

const validation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new BadRequests(
        "Validation Error",
        HTTP_STATUS_CODES.BAD_REQUEST,
        error
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validation;
