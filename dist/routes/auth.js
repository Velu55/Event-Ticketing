"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controller/auth"));
const schema_1 = require("../validation-schema/schema");
const vaildation_1 = __importDefault(require("../middleware/vaildation"));
const router = (0, express_1.Router)();
router.put("/signup", schema_1.signupSchema, vaildation_1.default, auth_1.default.signup);
router.post("/login", schema_1.loginSchema, vaildation_1.default, auth_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.js.map