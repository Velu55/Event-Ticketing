import { Router } from "express";
import userController from "../controller/user";
import isAuth from "../middleware/is-auth";
import {
  cartUpdateSchema,
  cartdeleteSchema,
  saveCartSchema,
} from "../validation-schema/schema";
const router = Router();

router.post("/getall-event", isAuth, userController.getAllEvent);
router.get("/get-event/:id", isAuth, userController.getEvent);
router.get("/get-cart", isAuth, userController.getCart);
router.put("/cart-save", isAuth, saveCartSchema, userController.postCart);
router.post(
  "/cart-update",
  isAuth,
  cartUpdateSchema,
  userController.updateCart
);
router.delete(
  "/cart-delete",
  isAuth,
  cartdeleteSchema,
  userController.deleteCart
);

export default router;
