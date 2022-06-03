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
exports.connect = void 0;
const promise_1 = require("mysql2/promise");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const userLimit = parseInt(process.env.DB_LIMIT || '');
        const dbLimit = Number.isInteger(userLimit) ? userLimit : 20;
        const userPort = parseInt(process.env.DB_PORT || '');
        const dbPort = Number.isInteger(userPort) ? userPort : 3306;
        const connection = yield (0, promise_1.createPool)({
            host: process.env.DB_HOST,
            port: dbPort,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            connectionLimit: dbLimit
        });
        return connection;
    });
}
exports.connect = connect;
//# sourceMappingURL=database.js.map