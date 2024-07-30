import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import mongodbstore from "connect-mongodb-session";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import { errorHandler } from "./middleware/error";
import { NotFound } from "./errors/NotFound";
dotenv.config({ path: `config.env` });

const app = express();
const port: number = +process.env.PORT! || 3000;
const dburl: string = process.env.DATABASE_URL!;
const mongosession = mongodbstore(session);
const store = new mongosession({
  uri: dburl,
  collection: "session",
});
app.use(
  session({
    secret: process.env.SESSION_SECRECT!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(express.json());

app.use(authRouter);
app.use(adminRouter);
app.use(userRouter);

app.use((req: Request, res: Response) => {
  console.log(req);
  throw new NotFound("Route Not Found", 404, []);
  console.log(res);
});
app.use(errorHandler);

mongoose
  .connect(dburl)
  .then((result) => {
    console.log("Db connected...!" + result);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("App listen 3000");
});
