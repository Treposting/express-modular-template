"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../../middlewares/authorization");
const verifyToken_1 = require("../../../middlewares/verifyToken");
const Statistics_controller_1 = require("./Statistics.controller");
const router = express_1.default.Router();
router.get('/sevendays', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer', 'admin']), Statistics_controller_1.getSevenDaysStatisticsController);
router.get('/current-month', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer', 'admin']), Statistics_controller_1.getthisMonthStatisticsController);
exports.StaticticsRoutes = router;
