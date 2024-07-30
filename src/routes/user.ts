import { Router } from "express";
import userController from "../controller/user";
import isAuth from "../middleware/is-auth";
import {
  cartUpdateSchema,
  cartdeleteSchema,
  saveCartSchema,
  orderSchema,
  orderCancelSchema,
} from "../validation-schema/schema";
import validation from "../middleware/vaildation";

const router = Router();

router.post("/getall-event", isAuth, userController.getAllEvent);
router.get("/get-event/:id", isAuth, userController.getEvent);
router.get("/get-cart", isAuth, userController.getCart);
router.put(
  "/cart-save",
  isAuth,
  saveCartSchema,
  validation,
  userController.postCart
);
router.post(
  "/cart-update",
  isAuth,
  cartUpdateSchema,
  validation,
  userController.updateCart
);
router.delete(
  "/cart-delete",
  isAuth,
  cartdeleteSchema,
  validation,
  userController.deleteCart
);

router.put(
  "/order-save",
  isAuth,
  orderSchema,
  validation,
  userController.putOrder
);
router.get("/order-details/:id", isAuth, userController.getOrder);
router.post(
  "/order-cancel",
  isAuth,
  orderCancelSchema,
  validation,
  userController.cancelOrder
);
export default router;
