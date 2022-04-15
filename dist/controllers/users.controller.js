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
exports.createUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, database_1.connect)();
        const users = yield conn.query('SELECT * FROM users');
        return res.json(users[0]);
    });
}
exports.getUsers = getUsers;
//Se crea una funcion para crear un usuario
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = req.body;
        const conn = yield (0, database_1.connect)();
        const user_conf = yield conn.query('SELECT * FROM users  WHERE email = ?', [newUser.email]);
        const salt = yield bcrypt_1.default.genSalt(10);
        if (user_conf[0].length == 0) {
            // Keeping the user and encryption of the password
            newUser.user_password = bcrypt_1.default.hashSync(newUser.user_password, salt);
            newUser.confirm_password = bcrypt_1.default.hashSync(newUser.confirm_password, salt);
            yield conn.query('INSERT INTO users SET ?', [newUser]);
            //creating a token
            const token = jsonwebtoken_1.default.sign({
                user_ID: newUser.id
            }, process.env.TOKEN_SECRET || 'my_secret_token');
            return res.header('token', token).json({
                newUser,
            });
        }
        else {
            return res.status(404).json({ message: 'User already exists' });
        }
    });
}
exports.createUser = createUser;
//# sourceMappingURL=users.controller.js.map