"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, database_1.connect)();
        const users = yield conn.query('SELECT * FROM users');
        return res.json(users[0]);
    });
}
exports.getUsers = getUsers;
//create a function to login
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const conn = yield (0, database_1.connect)();
        const users = yield conn.query('SELECT * FROM users  WHERE email = ?', [email]);
        console.log(users[0].length);
        if (users[0].length > 0) {
            if (bcrypt_1.default.compareSync(password, users[0][0].user_password)) {
                return res.json({
                    message: 'User logged in'
                });
            }
            else {
                return res.status(404).json({ message: 'The passwords do not match' });
            }
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
}
exports.loginUser = loginUser;
//# sourceMappingURL=login.controller.js.map