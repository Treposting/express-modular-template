"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const generateToken = (userInfo) => {
    const payload = {
        email: userInfo.email,
        role: userInfo.role,
        _id: userInfo.id,
        orgId: userInfo.orgId,
    };
    const token = jsonwebtoken_1.default.sign(payload, configs_1.default.jwt_secret, {
        expiresIn: configs_1.default.jwt_expiresIn,
    });
    return token;
};
exports.generateToken = generateToken;
