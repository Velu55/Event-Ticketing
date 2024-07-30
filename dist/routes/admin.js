"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../controller/admin"));
const schema_1 = require("../validation-schema/schema");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const is_admin_1 = __importDefault(require("../middleware/is-admin"));
const router = (0, express_1.Router)();
router.put("/create-event", schema_1.eventSchema, is_auth_1.default, is_admin_1.default, admin_1.default.newEvent);
router.post("/update-event", schema_1.eventSchema, is_auth_1.default, is_admin_1.default, admin_1.default.updateEvent);
router.delete("/delete-event/:id", is_auth_1.default, is_admin_1.default, admin_1.default.deleteEvent);
router.post("/role-change", schema_1.roleSchema, is_auth_1.default, is_admin_1.default, admin_1.default.roleChnage);
exports.default = router;
//# sourceMappingURL=admin.js.map