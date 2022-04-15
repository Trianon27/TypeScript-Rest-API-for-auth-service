"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const changePassword_controller_1 = require("../controllers/changePassword.controller");
router.route('/')
    .get(changePassword_controller_1.getUsers)
    .put(changePassword_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=changePassword.route.js.map