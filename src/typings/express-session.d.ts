// eslint-disable-next-line @typescript-eslint/no-unused-vars
import session from "express-session";
import { ObjectId } from "mongodb";

declare module "express-session" {
  export interface SessionData {
    logged: boolean;
    user: {
      id: ObjectId;
      name: string;
      role: string;
      email: string;
    };
  }
}
