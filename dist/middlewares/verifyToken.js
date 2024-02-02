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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || '';
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        // console.log(`token: ${token}`);
        // console.log(`JWT_SECRET: ${JWT_SECRET}`);
        if (!token) {
            return res.status(401).send({
                message: 'Access Denied',
                status: 401,
            });
        }
        // verify token
        // const decoded = jwt_decode(token);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.body.user = decoded;
        // console.log(`decoded :`, decoded);
        next();
    }
    catch (error) {
        res.status(401).send({
            message: 'Unauthorized access',
            status: 401,
        });
    }
});
exports.verifyToken = verifyToken;
