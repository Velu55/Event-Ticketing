import { NextFunction, Request, Response } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user?.role == "admin") {
    next();
  } else {
    return res.status(401).json({
      error: "Unauthenticated User...!",
    });
  }
};

export default isAdmin;
