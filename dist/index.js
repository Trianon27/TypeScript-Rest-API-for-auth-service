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
const dotenv_1 = __importDefault(require("dotenv"));
const ldap_auth_1 = require("./lalu_ldap/ldap_auth");
dotenv_1.default.config();
const app_1 = require("./app");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new app_1.App(3000);
        yield app.listen();
        (0, ldap_auth_1.authenticateDN)("cn=admin,dc=lalu,dc=unal,dc=edu,dc=co", "admin");
    });
}
main();
//# sourceMappingURL=index.js.map