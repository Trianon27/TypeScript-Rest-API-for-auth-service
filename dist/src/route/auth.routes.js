"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controllers/auth.controller");
const validateToken_1 = require("../libs/validateToken");
router.route('/');
router.post('/login', auth_controller_1.loginUser);
router.get('/profile', validateToken_1.tokenValidation, auth_controller_1.showProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map