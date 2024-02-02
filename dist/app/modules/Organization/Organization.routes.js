"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../../middlewares/authorization");
const verifyToken_1 = require("../../../middlewares/verifyToken");
const Organization_controller_1 = require("./Organization.controller");
const router = express_1.default.Router();
// Get all roles
router.get('/all', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'hr', 'developer']), Organization_controller_1.getAllOrganizationsController);
router.post('/create', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'hr', 'developer']), Organization_controller_1.createOrganizationController);
router.get('/get/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'hr', 'developer']), Organization_controller_1.getSingleOrganizationController);
router.patch('/update-status/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'hr', 'developer']), Organization_controller_1.updateOrganizationStatusController);
router.patch('/update-organization/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'hr', 'developer']), Organization_controller_1.updateSingleOrganizationController);
router.delete('/delete/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer']), Organization_controller_1.deleteOrganizationsController);
router.post('/revert/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer']), Organization_controller_1.revertOrganizationsController);
exports.OrganizationRoutes = router;
