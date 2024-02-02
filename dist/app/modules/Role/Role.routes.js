"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../../middlewares/authorization");
const verifyToken_1 = require("../../../middlewares/verifyToken");
const Role_controller_1 = require("./Role.controller");
const router = express_1.default.Router();
// Create a new role
router.post('/create', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer']), Role_controller_1.createRoleController);
// Get all roles
router.get('/', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer']), Role_controller_1.getRoleController);
exports.RoleRoutes = router;
