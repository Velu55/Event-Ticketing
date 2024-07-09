import { Router } from "express";
import authController from "../controller/auth";
import { signupSchema, loginSchema } from "../validation-schema/schema";
const router = Router();


router.post('/signup', signupSchema ,authController.signup);
router.post('/login', loginSchema, authController.login);
export default router;
