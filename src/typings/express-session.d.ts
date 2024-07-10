// eslint-disable-next-line @typescript-eslint/no-unused-vars
import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    logged: boolean;
    user: {
      id: string;
      role: string;
      email: string;
    };
  }
}
