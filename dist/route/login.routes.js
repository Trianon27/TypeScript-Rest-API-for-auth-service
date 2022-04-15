"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const login_controller_1 = require("../controllers/login.controller");
router.route('/')
    .get(login_controller_1.getUsers)
    .post(login_controller_1.loginUser);
exports.default = router;
//# sourceMappingURL=login.routes.js.map