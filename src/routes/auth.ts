import { Router } from "express";
import authController from "../controller/auth";
import { signupSchema, loginSchema } from "../validation-schema/schema";
import validation from "../middleware/vaildation";
const router = Router();

router.put("/signup", signupSchema, validation, authController.signup);
router.post("/login", loginSchema, validation, authController.login);
export default router;
