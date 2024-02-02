"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../../middlewares/authorization");
const verifyToken_1 = require("../../../middlewares/verifyToken");
const schedules_controller_1 = require("./schedules.controller");
const router = express_1.default.Router();
router.post('/create-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'developer']), schedules_controller_1.createScheduleController);
router.get('/', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['hr', 'superAdmin', 'developer']), schedules_controller_1.getAllSchedulesController);
router.get('/my-orgs-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.getMyOrgsSchedulesController);
router.put('/edit-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.editScheduleController);
router.put('/edit-schedule-caregiver', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.editScheduleCaregiverAssignmentsController);
router.delete('/delete-schedule/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.deleteScheduleController);
router.delete('/delete-organization-schedule/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['superAdmin', 'developer']), schedules_controller_1.deleteOrganizationScheduleController);
router.get('/client-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.getClientsScheduleController);
router.get('/caregiver-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.getCaregiversScheduleController);
router.get('/caregiver-my-schedule', verifyToken_1.verifyToken, (0, authorization_1.authorization)([
    'admin',
    'hr',
    'superAdmin',
    'developer',
    'caregiver',
    'cna',
    'office-staff',
]), schedules_controller_1.getCaregiverMyScheduleController);
router.get('/single/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.getSinglesScheduleController);
router.put('/update-excluded-dates/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.updateExcludedDatesController);
router.delete('/delete-excluded-dates', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.deleteExcludedWeeksController);
router.patch('/edit-schedule-status/:id', verifyToken_1.verifyToken, (0, authorization_1.authorization)(['admin', 'hr', 'superAdmin', 'developer']), schedules_controller_1.editScheduleStatusController);
exports.scheduleRoutes = router;
