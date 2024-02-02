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
exports.updatePasswordController = exports.updateUserDetailsController = exports.updateStatusController = exports.deleteUserDocumentController = exports.getUserRegistrationCountsController = exports.updateDocuments = exports.uploadDocuments = exports.uploadProfilePicture = exports.getAllOrgCaregiversController = exports.getLoggedInOrgClientssController = exports.getLoggedInOrgCaregiversController = exports.resetPasswordController = exports.forgotPasswordController = exports.getSpecificUserController = exports.getMeController = exports.getAnOrgUsersController = exports.getAllUsersController = exports.logInController = exports.signUpController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginatation_1 = require("../../../constant/paginatation");
const pick_1 = __importDefault(require("../../../utils/pick"));
const responseHandler_1 = __importDefault(require("../../../utils/responseHandler"));
const user_constatnt_1 = require("./user.constatnt");
const users_service_1 = require("./users.service");
// sign up controller
const signUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = req.body; // You can parse the user information from the request body
        const result = yield (0, users_service_1.signUpService)(userInfo);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: result,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        next(error);
    }
});
exports.signUpController = signUpController;
// log in controller
const logInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = req.body; // You can parse the user information from the request body
        const result = yield (0, users_service_1.logInService)(userInfo);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Successfully logged in !',
            data: result,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        next(error);
    }
});
exports.logInController = logInController;
// get all users controller
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, user_constatnt_1.userFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        const result = yield (0, users_service_1.getAllUsersService)(filters, paginationOptions);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersController = getAllUsersController;
// get an organization's all user
const getAnOrgUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, user_constatnt_1.userFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        const orgId = req.body.user.orgId; // Assuming you pass the user ID in the URL parameter
        const result = yield (0, users_service_1.getAnOrgUsersService)(filters, paginationOptions, orgId);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAnOrgUsersController = getAnOrgUsersController;
// Controller for getting user profile
const getMeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req.body:', req.body)
        const userId = req.body.user._id; // Assuming you pass the user ID in the URL parameter
        // Call the getMeService function to retrieve the user profile
        const user = yield (0, users_service_1.getSpecificUserService)(userId);
        if (user) {
            // Send a success response with the user data
            (0, responseHandler_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: 'User profile retrieved successfully',
                data: user,
            });
        }
        else {
            // Send a response indicating that the user was not found
            (0, responseHandler_1.default)(res, {
                statusCode: http_status_1.default.NOT_FOUND,
                success: false,
                message: 'User not found',
                data: null,
            });
        }
    }
    catch (error) {
        // Handle any unexpected errors
        next(error);
    }
});
exports.getMeController = getMeController;
// get specific user controller
const getSpecificUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req.body:', req.body)
        const userId = req.params.id;
        // Call the getMeService function to retrieve the user profile
        const user = yield (0, users_service_1.getSpecificUserService)(userId);
        if (user) {
            // Send a success response with the user data
            (0, responseHandler_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: 'User profile retrieved successfully',
                data: user,
            });
        }
        else {
            // Send a response indicating that the user was not found
            (0, responseHandler_1.default)(res, {
                statusCode: http_status_1.default.NOT_FOUND,
                success: false,
                message: 'User not found',
                data: null,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getSpecificUserController = getSpecificUserController;
// forget password controller
const forgotPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const referer = req.get('referer');
        const baseUrl = `${referer}`;
        const result = yield (0, users_service_1.forgotPasswordService)(email, baseUrl);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP sent successfully !',
            data: result,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        next(error);
    }
});
exports.forgotPasswordController = forgotPasswordController;
// reset password controller
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const { otp, password } = req.body;
        const result = yield (0, users_service_1.resetPasswordService)(email, otp, password);
        res.status(200).json({
            status: result.status,
            message: result.message,
        });
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordController = resetPasswordController;
// get logged in organizations caregivers
const getLoggedInOrgCaregiversController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, user_constatnt_1.userFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        const orgId = req.body.user.orgId; // Assuming you pass the user ID in the URL parameter
        const result = yield (0, users_service_1.getAnOrgCaregiverService)(filters, paginationOptions, orgId);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getLoggedInOrgCaregiversController = getLoggedInOrgCaregiversController;
const getLoggedInOrgClientssController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, user_constatnt_1.userFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        const orgId = req.body.user.orgId; // Assuming you pass the user ID in the URL parameter
        const result = yield (0, users_service_1.getAnOrgClientsService)(filters, paginationOptions, orgId);
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getLoggedInOrgClientssController = getLoggedInOrgClientssController;
const getAllOrgCaregiversController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, user_constatnt_1.userFilterableFields);
        const paginationOptions = (0, pick_1.default)(req.query, paginatation_1.paginationFields);
        // const orgId = req.body.user.orgId // Assuming you pass the user ID in the URL parameter
        const result = yield (0, users_service_1.getAnOrgCaregiverService)(filters, paginationOptions
        // orgId
        );
        // console.log('result:', result)
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User fetched successfully !',
            meta: result.meta,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrgCaregiversController = getAllOrgCaregiversController;
// uploadProfilePicture
const uploadProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req);
        res.status(200).json({
            status: 'success',
            message: 'Image uploaded successfully',
            data: req.files,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
// upload documents
const uploadDocuments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body)
        // Get the user's ID from the request or wherever it's available
        const { userId, fileName } = req.body;
        const files = req.files;
        console.log('filename:', fileName);
        // Assuming you have access to the uploaded file through req.files
        if (!req.files) {
            throw new Error('No file uploaded');
        }
        // Call the uploadUsersFileService to upload the document
        const result = yield (0, users_service_1.uploadUsersFileService)(userId, fileName, req.files);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Document uploaded successfully!',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadDocuments = uploadDocuments;
const updateDocuments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // console.log(req);
        // Get the user's ID from the request or wherever it's available
        const { userId, documentId, fileName, time } = req.body;
        const files = req === null || req === void 0 ? void 0 : req.files;
        const fileLocation = (_a = files[0]) === null || _a === void 0 ? void 0 : _a.location;
        console.log('files: ', files);
        // Call the uploadUsersFileService to upload the document
        const result = yield (0, users_service_1.editUserNameAndFilesService)(userId, documentId, fileName, time, fileLocation);
        (0, responseHandler_1.default)(res, {
            statusCode: result.statusCode,
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateDocuments = updateDocuments;
// get User RegistrationCounts
const getUserRegistrationCountsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectedMonth = req.query.month; // Get the selected month from the query parameters
        const result = yield (0, users_service_1.getUserRegistrationCountsService)(selectedMonth);
        const successMessage = selectedMonth
            ? `User data for ${selectedMonth} fetched successfully!`
            : 'User data fetched successfully!';
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: successMessage,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserRegistrationCountsController = getUserRegistrationCountsController;
// delete user document controller
const deleteUserDocumentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, documentId } = req.body;
        console.log('userId:', userId);
        console.log('documentId:', documentId);
        const result = yield (0, users_service_1.deletseUsersDocumentsService)(userId, documentId);
        (0, responseHandler_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Document deleted successfully!',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserDocumentController = deleteUserDocumentController;
// updateStatusController
const updateStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        const reqUserID = req.body.user._id;
        const result = yield (0, users_service_1.updateStatusService)(id, status, reqUserID, reason);
        (0, responseHandler_1.default)(res, {
            statusCode: result.statusCode,
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateStatusController = updateStatusController;
//updateUserDetailsController
const updateUserDetailsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _b = req.body, { user } = _b, data = __rest(_b, ["user"]);
        const reqUserID = user._id;
        const result = yield (0, users_service_1.updateUserDetailsService)(id, reqUserID, data);
        (0, responseHandler_1.default)(res, {
            statusCode: result.statusCode,
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserDetailsController = updateUserDetailsController;
// update user's password
const updatePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, oldPassword, newPassword } = req.body;
        const reqUserID = user._id;
        const result = yield (0, users_service_1.updateUserPasswordService)(reqUserID, oldPassword, newPassword);
        (0, responseHandler_1.default)(res, {
            statusCode: result.statusCode,
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePasswordController = updatePasswordController;
