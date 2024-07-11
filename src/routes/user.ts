import { Router } from "express";
import userController from "../controller/user";
const router = Router();
import isAuth from "../middleware/is-auth";

router.post("/getall-event", isAuth, userController.getAllEvent);
router.get("/get-event/:id", isAuth, userController.getEvent);

export default router;
