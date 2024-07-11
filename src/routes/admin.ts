import { Router } from "express";
import adminController from "../controller/admin";
import { eventSchema, roleSchema } from "../validation-schema/schema";
import isAuth from "../middleware/is-auth";
import isAdmin from "../middleware/is-admin";
const router = Router();

router.put(
  "/create-event",
  eventSchema,
  isAuth,
  isAdmin,
  adminController.newEvent
);
router.post(
  "/update-event",
  eventSchema,
  isAuth,
  isAdmin,
  adminController.updateEvent
);

router.delete(
  "/delete-event/:id",
  isAuth,
  isAdmin,
  adminController.deleteEvent
);

router.post(
  "/role-change",
  roleSchema,
  isAuth,
  isAdmin,
  adminController.roleChnage
);
export default router;
