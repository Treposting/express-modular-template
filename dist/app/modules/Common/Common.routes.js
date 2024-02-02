"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Common_controller_1 = require("./Common.controller");
const router = express_1.default.Router();
// Create a new role
router.get('/companyName', Common_controller_1.getCompanyController);
exports.CommonRoutes = router;
