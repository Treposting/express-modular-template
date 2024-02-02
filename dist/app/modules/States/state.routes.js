"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../../../middlewares/verifyToken");
const state_controller_1 = require("./state.controller");
const router = express_1.default.Router();
router.get('/', verifyToken_1.verifyToken, 
// authorization(['superAdmin', 'hr', 'developer', 'admin']),
state_controller_1.statesControllers.getAllStates);
exports.statesRoutes = router;
