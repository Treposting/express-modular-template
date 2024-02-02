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
exports.revertOrganizationsController = exports.deleteOrganizationsController = exports.updateSingleOrganizationController = exports.getSingleOrganizationController = exports.updateOrganizationStatusController = exports.createOrganizationController = exports.getAllOrganizationsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginatation_1 = require("../../../constant/paginatation");
const pick_1 = __importDefault(require("../../../utils/pick"));
const responseHandler_1 = __importDefault(require("../../../utils/responseHandler"));
const Organization_constant_1 = require("./Organization.constant");
const Organization_service_1 = require("./Organization.service");
const getAllOrganizationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Organization_constant_1.orgFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        const result = yield (0, Organization_service_1.getAllOrganizationsService)(filters, paginationOptions);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully fetched all organizations',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrganizationsController = getAllOrganizationsController;
const createOrganizationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputData = req.body;
        const result = yield (0, Organization_service_1.createOrganizationService)(inputData);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully created organization',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createOrganizationController = createOrganizationController;
// updateOrganizationStatusController
const updateOrganizationStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        const reqUserID = req.body.user._id;
        const result = yield (0, Organization_service_1.updateOrganizationStatusService)(id, status, reqUserID, reason);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully updated organization status',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateOrganizationStatusController = updateOrganizationStatusController;
//getSingleOrganizationController
const getSingleOrganizationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, Organization_service_1.getSingleOrganizationService)(id);
        // console.log('result', result);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully fetched single organization',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSingleOrganizationController = getSingleOrganizationController;
// updateSingleOrganizationController
const updateSingleOrganizationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = __rest(req.body, []);
        const reqUserID = req.body.user._id;
        const result = yield (0, Organization_service_1.updateSingleOrganizationService)(id, data, reqUserID);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully updated organization status',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateSingleOrganizationController = updateSingleOrganizationController;
// deleteOrganizationsController
const deleteOrganizationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.body.user;
        const reqUserId = user._id;
        const result = yield (0, Organization_service_1.deleteOrganizationsService)(id, reqUserId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully deleted organization's data",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteOrganizationsController = deleteOrganizationsController;
const revertOrganizationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.body.user;
        const reqUserId = user._id;
        const result = yield (0, Organization_service_1.revertDeletionsService)(id, reqUserId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully deleted organization's data",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.revertOrganizationsController = revertOrganizationsController;
