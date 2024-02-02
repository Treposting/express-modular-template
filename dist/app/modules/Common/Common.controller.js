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
exports.getCompanyController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const configs_1 = __importDefault(require("../../../configs"));
const responseHandler_1 = __importDefault(require("../../../utils/responseHandler"));
const getCompanyController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = configs_1.default.company_name;
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully fetched company name',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCompanyController = getCompanyController;
