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
exports.getthisMonthStatisticsController = exports.getSevenDaysStatisticsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const responseHandler_1 = __importDefault(require("../../../utils/responseHandler"));
const Statistics_service_1 = require("./Statistics.service");
// get statistics by previous 7days
const getSevenDaysStatisticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const orgId = user.orgId;
        const result = yield (0, Statistics_service_1.getSevenDaysStatisticsService)(orgId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully fetched previous 7days statistics',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSevenDaysStatisticsController = getSevenDaysStatisticsController;
const getthisMonthStatisticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const orgId = user.orgId;
        const result = yield (0, Statistics_service_1.getThisMonthStatisticsService)(orgId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully fetched previous 7days statistics',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getthisMonthStatisticsController = getthisMonthStatisticsController;
