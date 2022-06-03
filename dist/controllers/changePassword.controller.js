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
exports.changePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ldap_auth_1 = require("../lalu_ldap/ldap_auth");
const database_1 = require("../database");
//create a function to change password
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, user_password, confirm_password } = req.body;
        const conn = yield (0, database_1.connect)();
        const users = yield conn.query('SELECT * FROM users  WHERE email = ?', [email]);
        //console.log(users[0].length);
        if (users[0].length > 0) {
            if (bcrypt_1.default.compareSync(user_password, users[0][0].user_password)) {
                return res.json({ message: "Can't change password, the password is the same" });
            }
            else {
                if (user_password === confirm_password) {
                    yield conn.query('UPDATE users SET user_password = ?, confirm_password = ? WHERE email = ?', [bcrypt_1.default.hashSync(user_password, 10),
                        bcrypt_1.default.hashSync(confirm_password, 10), email]);
                    //modify password on LDAP
                    (0, ldap_auth_1.modifyPassword)(users[0][0].user_name, bcrypt_1.default.hashSync(user_password, 10));
                    return res.json({ message: "Password changed" });
                }
                else {
                    return res.status(404).json({ message: 'The passwords do not match' });
                }
            }
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
}
exports.changePassword = changePassword;
//# sourceMappingURL=changePassword.controller.js.map