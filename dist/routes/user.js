"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controller/user"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const schema_1 = require("../validation-schema/schema");
const vaildation_1 = __importDefault(require("../middleware/vaildation"));
const router = (0, express_1.Router)();
router.post("/getall-event", is_auth_1.default, user_1.default.getAllEvent);
router.get("/get-event/:id", is_auth_1.default, user_1.default.getEvent);
router.get("/get-cart", is_auth_1.default, user_1.default.getCart);
router.put("/cart-save", is_auth_1.default, schema_1.saveCartSchema, vaildation_1.default, user_1.default.postCart);
router.post("/cart-update", is_auth_1.default, schema_1.cartUpdateSchema, vaildation_1.default, user_1.default.updateCart);
router.delete("/cart-delete", is_auth_1.default, schema_1.cartdeleteSchema, vaildation_1.default, user_1.default.deleteCart);
router.put("/order-save", is_auth_1.default, schema_1.orderSchema, vaildation_1.default, user_1.default.putOrder);
router.get("/order-details/:id", is_auth_1.default, user_1.default.getOrder);
router.post("/order-cancel", is_auth_1.default, schema_1.orderCancelSchema, vaildation_1.default, user_1.default.cancelOrder);
exports.default = router;
//# sourceMappingURL=user.js.map