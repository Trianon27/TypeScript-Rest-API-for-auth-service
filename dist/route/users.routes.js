"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_controller_1 = require("../controllers/users.controller");
router.route('/')
    .get(users_controller_1.getUsers)
    .post(users_controller_1.createUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map