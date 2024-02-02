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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExcludedWeeksController = exports.updateExcludedDatesController = exports.getSinglesScheduleController = exports.deleteOrganizationScheduleController = exports.deleteScheduleController = exports.editScheduleStatusController = exports.editScheduleCaregiverAssignmentsController = exports.editScheduleController = exports.getClientsScheduleController = exports.getCaregiverMyScheduleController = exports.getCaregiversScheduleController = exports.getMyOrgsSchedulesController = exports.getAllSchedulesController = exports.createScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const responseHandler_1 = __importDefault(require("../../../utils/responseHandler"));
const schedules_service_1 = require("./schedules.service");
const createScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = __rest(req.body, []);
    const user = req.body.user;
    const newData = Object.assign(Object.assign({}, data), { createdBy: user._id, organization: user.orgId });
    try {
        const schedule = yield (0, schedules_service_1.createSchedulesService)(newData);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule created successfully !',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createScheduleController = createScheduleController;
const getAllSchedulesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId, shiftType, scheduleType, date, caregiverId, clientId, page, limit, } = req.query;
        // console.log(`controller ${organizationId}`)
        const result = yield (0, schedules_service_1.getAllSchedulesService)(organizationId, shiftType, scheduleType, date, caregiverId, clientId, page, limit);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSchedulesController = getAllSchedulesController;
const getMyOrgsSchedulesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shiftType, scheduleType, date, caregiverId, clientId, page, limit, } = req.query;
        const user = req.body.user;
        const organizationId = user.orgId;
        // console.log(req.query);
        // console.log(`controller ${organizationId}`)
        const result = yield (0, schedules_service_1.getAllSchedulesService)(organizationId, shiftType, scheduleType, date, caregiverId, clientId, page, limit);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyOrgsSchedulesController = getMyOrgsSchedulesController;
const getCaregiversScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { caregiverId, scheduleType, startDate, endDate, month, shiftType, endTime, } = req.query;
    try {
        const filters = {
            caregiverId: caregiverId,
            scheduleType: scheduleType,
            startDate: startDate,
            endDate: endTime,
            shiftType: shiftType,
            month: month,
        };
        const schedule = yield (0, schedules_service_1.getCaregiversSchedules)(filters);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCaregiversScheduleController = getCaregiversScheduleController;
// caregiver my schedule
const getCaregiverMyScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { caregiverId, scheduleType, startDate, endDate, month, shiftType, endTime, } = req.query;
    const user = req.body.user;
    // console.log(`controller`, user._id);
    try {
        const filters = {
            caregiverId: user._id,
            scheduleType: scheduleType,
            startDate: startDate,
            endDate: endTime,
            shiftType: shiftType,
            month: month,
        };
        const schedule = yield (0, schedules_service_1.getCaregiversSchedules)(filters);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCaregiverMyScheduleController = getCaregiverMyScheduleController;
const getClientsScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, scheduleType, startDate, endDate, month, shiftType, endTime, } = req.query;
    try {
        const filters = {
            clientId: clientId,
            scheduleType: scheduleType,
            startDate: startDate,
            endDate: endTime,
            shiftType: shiftType,
            month: month,
        };
        const schedule = yield (0, schedules_service_1.getClientsSchedules)(filters);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getClientsScheduleController = getClientsScheduleController;
// editScheduleController
const editScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = __rest(req.body, []);
    const user = req.body.user;
    const newData = Object.assign(Object.assign({}, data), { organization: user.orgId });
    try {
        const schedule = yield (0, schedules_service_1.editScheduleService)(newData, user);
        // console.log(`controller`, schedule)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule updated successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editScheduleController = editScheduleController;
// editScheduleCaregiverAssignmentsController
const editScheduleCaregiverAssignmentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { scheduleId, caregiverAssignments } = req.body; // Assuming these fields are present in req.body
    const user = req.body.user;
    const userId = user._id;
    try {
        const updatedSchedule = yield (0, schedules_service_1.updateCaregiverAssignmentsService)(scheduleId, caregiverAssignments, userId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Caregiver assignments updated successfully!',
            data: updatedSchedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editScheduleCaregiverAssignmentsController = editScheduleCaregiverAssignmentsController;
// editScheduleController
const editScheduleStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    const { status } = req.body;
    const user = req.body.user;
    const userId = user._id;
    try {
        const schedule = yield (0, schedules_service_1.editScheduleStatusService)(scheduleId, userId, status);
        // console.log(`controller`, schedule)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule updated successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editScheduleStatusController = editScheduleStatusController;
// schedule delete controller
const deleteScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    console.log(`controller`, scheduleId);
    try {
        const schedule = yield (0, schedules_service_1.deleteScheduleService)(scheduleId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule deleted successfully !',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteScheduleController = deleteScheduleController;
// delete organization's schedule
const deleteOrganizationScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const orgId = user.orgId;
    try {
        const schedule = yield (0, schedules_service_1.deleteOrganizationScheduleService)(orgId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule deleted successfully !',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOrganizationScheduleController = deleteOrganizationScheduleController;
// getSinglesScheduleController
const getSinglesScheduleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    // console.log(`controller`, scheduleId)
    try {
        const schedule = yield (0, schedules_service_1.getSingleScheduleService)(scheduleId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Schedule fetched successfully !',
            data: schedule,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSinglesScheduleController = getSinglesScheduleController;
// updateExcludedDatesController
const updateExcludedDatesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleId = req.params.id;
    const { excludedWeeks } = req.body;
    try {
        const updatedSchedule = yield (0, schedules_service_1.updateExcludedDatesService)(scheduleId, excludedWeeks);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Excluded dates updated successfully!',
            data: updatedSchedule,
        });
    }
    catch (error) {
        // Handle other errors
        next(error);
    }
});
exports.updateExcludedDatesController = updateExcludedDatesController;
// deleteExcludedDatesController
const deleteExcludedWeeksController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scheduleId, excludedWeeksId } = req.body;
        yield (0, schedules_service_1.deleteExcludedWeeksService)(scheduleId, excludedWeeksId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Excluded dates deleted successfully!',
        });
    }
    catch (error) {
        // Handle other errors
        next(error);
    }
});
exports.deleteExcludedWeeksController = deleteExcludedWeeksController;
