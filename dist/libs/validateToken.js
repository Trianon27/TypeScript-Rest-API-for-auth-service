"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function tokenValidation(req, res, next) {
    try {
        const token = req.header('token');
        if (!token)
            return res.status(404).json({ message: 'Access denied' });
        const payload = jsonwebtoken_1.default.verify(token, process.env['TOKEN_SECRET'] || 'my_secret_token');
        req.userId = payload.id;
        next();
    }
    catch (e) {
        res.status(400).send('Invalid Token');
    }
}
exports.tokenValidation = tokenValidation;
//# sourceMappingURL=validateToken.js.map