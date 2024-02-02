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
exports.updateUserPasswordService = exports.updateUserDetailsService = exports.updateStatusService = exports.editUserNameAndFilesService = exports.deletseUsersDocumentsService = exports.getUserRegistrationCountsService = exports.uploadUsersFileService = exports.getAnOrgClientsService = exports.getAnOrgCaregiverService = exports.resetPasswordService = exports.forgotPasswordService = exports.getSpecificUserService = exports.getAnOrgUsersService = exports.getAllUsersService = exports.logInService = exports.signUpService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid"); // Import the uuid library
const hashedPassword_1 = __importDefault(require("../../../middlewares/hashedPassword"));
const paginate_1 = require("../../../middlewares/paginate");
const email_1 = require("../../../utils/email");
const otpGenerator_1 = require("../../../utils/otpGenerator");
const token_1 = require("../../../utils/token");
const Organization_model_1 = __importDefault(require("../Organization/Organization.model"));
const user_constatnt_1 = require("./user.constatnt");
const users_model_1 = require("./users.model");
// sign up service
const signUpService = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(userInfo)
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let organizationId;
        if (userInfo.organization) {
            organizationId = userInfo.organization.toString();
        }
        else {
            throw new Error('Organization ID is missing');
        }
        // Find the organization
        const organization = yield Organization_model_1.default.findById(organizationId).session(session);
        // Check if the organization is found
        if (!organization) {
            throw new Error('Organization not found');
        }
        const { password } = userInfo, others = __rest(userInfo, ["password"]);
        const newPass = yield (0, hashedPassword_1.default)(password);
        // Check if the user is already registered
        const existingUser = yield users_model_1.User.findOne({
            email: others.email,
        }).session(session);
        if (existingUser) {
            throw new Error('User is already registered');
        }
        // Create the user
        const user = yield users_model_1.User.create([Object.assign(Object.assign({}, userInfo), { password: newPass })], {
            session,
        });
        // Get the user IDs
        const userIds = user.map(u => u._id);
        // Push the user IDs to the organization's array
        yield Organization_model_1.default.findByIdAndUpdate(organizationId, {
            $push: { users: { $each: userIds } },
        }).session(session);
        const emailData = {
            to: userInfo.email,
            subject: 'Welcome to the System',
            template: 'views/template.ejs',
            templateData: { user: userInfo.name.firstName },
        };
        // Send the email
        (0, email_1.sendEmail)({
            to: emailData.to,
            subject: emailData.subject,
            template: 'views/template.ejs',
            templateData: emailData.templateData,
        });
        // Commit the transaction and return
        yield session.commitTransaction();
        session.endSession();
        return {
            status: 'Success',
            message: 'User created successfully',
        };
    }
    catch (error) {
        // Abort the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        return {
            status: 'Failed',
            message: error.message,
        };
    }
});
exports.signUpService = signUpService;
// log in service
const logInService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    // console.log('email:', email, 'password:', password)
    if (!email || !password) {
        throw new Error('Provide email or password');
    }
    // Find the user by email
    const userL = yield users_model_1.User.findOne({
        email: email,
    }).populate('organization', 'name address organizationStatus');
    // If no user found, throw an error
    if (!userL) {
        throw new Error('User is not found');
    }
    const isMatch = yield bcrypt_1.default.compare(password, userL.password);
    if (!isMatch) {
        throw new Error('Password is not correct');
    }
    // console.log(userL, 'userL')
    // if user's disablesStatus is true, throw an error
    if (userL.disablesStatus) {
        throw new Error('User is disabled, contact administrator');
    }
    if (userL.organization &&
        typeof userL.organization === 'object' &&
        'organizationStatus' in userL.organization &&
        userL.organization.organizationStatus === false) {
        throw new Error('Organization is disabled, contact administrator');
    }
    // Generate a token
    const token = (0, token_1.generateToken)({
        email: userL.email,
        role: userL.role,
        id: userL._id.toString(),
        orgId: userL.organization._id.toString(),
    });
    const loggedInUser = {
        message: 'Logged in successfully',
        token,
    };
    return loggedInUser;
});
exports.logInService = logInService;
// get all users service
const getAllUsersService = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement the search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder, skipLimit, organization } = paginate_1.paginationHelpers.calculatePagination(paginationOptions);
    // console.log(organization, 'organization')
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constatnt_1.userSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (organization) {
        andConditions.push({
            organization: organization,
        });
    }
    // Filters need $and to fulfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    if (skipLimit === 'YES') {
        // When skipLimit is 'YES', return all documents in a single page using .lean().
        const result = yield users_model_1.User.find(whereConditions)
            .populate('organization', 'name address')
            .select('-password -plainPassword')
            .sort(sortConditions)
            .lean();
        const total = yield users_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                page: 1,
                limit: total,
                total,
            },
            data: result,
        };
    }
    else {
        // Apply pagination as usual with skip and limit while using .lean().
        const result = yield users_model_1.User.find(whereConditions)
            .populate('organization', 'name address')
            .select('-password -plainPassword')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield users_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    }
});
exports.getAllUsersService = getAllUsersService;
// get an organization's all users
const getAnOrgUsersService = (filters, paginationOptions, orgId) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement the search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder, skipLimit, role } = paginate_1.paginationHelpers.calculatePagination(paginationOptions);
    console.log(role, 'role');
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constatnt_1.userSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (orgId) {
        andConditions.push({
            organization: orgId,
        });
    }
    if (role) {
        andConditions.push({
            role: role,
        });
    }
    // Filters need $and to fulfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    if (skipLimit === 'YES') {
        // When skipLimit is 'YES', return all documents in a single page using .lean().
        const result = yield users_model_1.User.find(whereConditions)
            .populate('organization', 'name address')
            .select('-password -plainPassword')
            .sort(sortConditions)
            .lean();
        const total = yield users_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                page: 1,
                limit: total,
                total,
            },
            data: result,
        };
    }
    else {
        // Apply pagination as usual with skip and limit while using .lean().
        const result = yield users_model_1.User.find(whereConditions)
            .populate('organization', 'name address')
            .select('-password -plainPassword')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield users_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    }
});
exports.getAnOrgUsersService = getAnOrgUsersService;
// get me
const getSpecificUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the user profile by its ID
    const user = yield users_model_1.User.findById(userId)
        .populate('organization', 'name address')
        .select('-password -plainPassword -passwordResetOTP -passwordResetExpires -passwordResetTimestamp -createdAt -updatedAt -__v')
        .lean();
    return user;
});
exports.getSpecificUserService = getSpecificUserService;
// forget password service
const forgotPasswordService = (email, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = (yield users_model_1.User.findOne({ email: email }).session(session));
        if (!user) {
            throw new Error('User not found');
        }
        const otpNumber = (0, otpGenerator_1.generateOTP)();
        // Update the user's passwordResetOTP and passwordResetExpires
        user.passwordResetOTP = Number(otpNumber);
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Save the changes within the transaction
        yield users_model_1.User.updateOne({ _id: user._id }, user).session(session);
        const emailData = {
            to: email,
            subject: 'Password Reset',
            template: 'views/password_reset_email.ejs',
            templateData: {
                user: user.name.firstName,
                otp: otpNumber,
                email: email,
                baseUrl: baseUrl,
            },
        };
        // Send the email
        (0, email_1.sendEmail)({
            to: emailData.to,
            subject: emailData.subject,
            template: 'views/password_reset_email.ejs',
            templateData: emailData.templateData,
        });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            status: 'success',
            message: 'An OTP has been generated and the user updated.',
            email: email,
        };
    }
    catch (error) {
        // Rollback the transaction in case of an error
        yield session.abortTransaction();
        session.endSession();
        throw new Error(error);
    }
});
exports.forgotPasswordService = forgotPasswordService;
// reset password service
const resetPasswordService = (email, otp, password) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const OTP = parseInt(otp);
        const user = (yield users_model_1.User.findOne({ email: email }).session(session));
        if (!user) {
            throw new Error('User not found');
        }
        // console.log(email, 'email')
        // console.log(user.passwordResetOTP, 'otp')
        // console.log(OTP, 'OTP')
        if (!password) {
            throw new Error('Password is required');
        }
        if (OTP !== user.passwordResetOTP) {
            throw new Error('OTP is not correct');
        }
        // Check the OTP expiration time
        const now = Date.now();
        const expirationTime = 15 * 60 * 1000; // 5 minutes
        const elapsedTime = now - user.passwordResetExpires.getTime();
        if (elapsedTime > expirationTime) {
            throw new Error('OTP code has expired');
        }
        // Hash the new password
        const hashedPassword = yield (0, hashedPassword_1.default)(password);
        user.password = hashedPassword;
        user.passwordResetOTP = null;
        user.passwordResetTimestamp = new Date();
        user.passwordResetExpires = null;
        user.plainPassword = password;
        // Use the Mongoose model to save the changes within the transaction
        yield users_model_1.User.updateOne({ _id: user._id }, user).session(session);
        // sendEmail({
        //   to: user.email,
        //   subject: 'Password reset successfully',
        //   html: `Your password has been reset successfully.`,
        // })
        // Commit the transaction
        yield session.commitTransaction();
        return { message: 'Password updateded successfully', status: 'success' };
    }
    catch (error) {
        // Rollback the transaction in case of an error
        yield session.abortTransaction();
        throw new Error(error.message);
    }
    finally {
        session.endSession();
    }
});
exports.resetPasswordService = resetPasswordService;
// get getAnOrgCaregiverService
const getAnOrgCaregiverService = (filters, paginationOptions, orgId) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement the search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder, skipLimit, role } = paginate_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (orgId) {
        andConditions.push({
            organization: orgId,
        });
    }
    // Add 'caregiver' and 'admin' roles
    andConditions.push({
        role: { $in: ['caregiver', 'admin', 'cna', 'office-staff'] },
    });
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield users_model_1.User.find(whereConditions)
        .populate('organization', 'name')
        .select('name email role')
        .lean();
    const total = yield users_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.getAnOrgCaregiverService = getAnOrgCaregiverService;
// get an orgs clients
const getAnOrgClientsService = (filters, paginationOptions, orgId) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement the search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder, skipLimit, role } = paginate_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (orgId) {
        andConditions.push({
            organization: orgId,
        });
    }
    // Add 'caregiver' and 'admin' roles
    andConditions.push({
        role: { $in: ['client'] },
    });
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield users_model_1.User.find(whereConditions)
        .populate('organization', 'name')
        .select('name email role')
        .lean();
    const total = yield users_model_1.User.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.getAnOrgClientsService = getAnOrgClientsService;
// upload user file service
const uploadUsersFileService = (userId, fileName, files) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = (yield users_model_1.User.findById(userId).session(session));
        // console.log(user, 'user');
        if (!user) {
            throw new Error('User not found');
        }
        const uploadedFile = {
            // Generate a unique ID for each document using uuid
            _id: (0, uuid_1.v4)(),
            fileName: fileName,
            fileUrl: (_a = files[0]) === null || _a === void 0 ? void 0 : _a.location,
        };
        user.documents.push(uploadedFile);
        yield users_model_1.User.updateOne({ _id: user._id }, user).session(session);
        yield session.commitTransaction();
        return { message: 'File uploaded successfully', status: 'success' };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error(error.message);
    }
    finally {
        session.endSession();
    }
});
exports.uploadUsersFileService = uploadUsersFileService;
// get user registration count
const getUserRegistrationCountsService = (selectedMonth) => __awaiter(void 0, void 0, void 0, function* () {
    let aggregationPipeline = [
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                Users: { $sum: 1 },
                Active: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }, // Rename 'active' to 'Active'
                },
                Inactive: {
                    $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }, // Rename 'inactive' to 'Inactive'
                },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ];
    if (selectedMonth) {
        const startDate = (0, moment_1.default)(selectedMonth, 'YYYY-MM').startOf('month').toDate();
        const endDate = (0, moment_1.default)(selectedMonth, 'YYYY-MM').endOf('month').toDate();
        aggregationPipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            ...aggregationPipeline,
        ];
    }
    aggregationPipeline.push({
        $group: {
            _id: null,
            totalUsers: { $sum: '$Users' },
            totalActive: { $sum: '$Active' },
            totalInactive: { $sum: '$Inactive' },
            registrationData: {
                $push: {
                    date: '$_id',
                    Users: '$Users',
                    Active: '$Active',
                    Inactive: '$Inactive',
                },
            },
        },
    });
    return users_model_1.User.aggregate(aggregationPipeline).exec();
});
exports.getUserRegistrationCountsService = getUserRegistrationCountsService;
// export const updateDocumentServices = async (
//   userId: string,
//   documentId: string,
//   updatedFileName: string,
//   uploadedFile?: string
// ): Promise<{ message: string; status: string }> => {
//   const session = await mongoose.startSession()
//   try {
//     session.startTransaction()
//     // console.log('uploadedFile', uploadedFile)
//     // console.log('updatedFileName', updatedFileName)
//     // console.log('documentId', documentId)
//     // console.log('userId', userId)
//     const user = (await User.findById(userId).session(session)) as IUser | null
//     if (!user) {
//       throw new Error('User not found')
//     }
//     const documentIndex = user.documents.findIndex(
//       doc => doc._id === documentId
//     )
//     console.log('documentIndex', documentIndex)
//     if (documentIndex === -1) {
//       throw new Error('Document not found')
//     }
//     // Update the document with the provided data, only if the data is provided
//     if (updatedFileName) {
//       user.documents[documentIndex].fileName = updatedFileName
//     }
//     if (uploadedFile !== undefined) {
//       user.documents[documentIndex].fileUrl = uploadedFile
//     }
//     // Save the modified user object back to the database
//     await User.updateOne({ _id: user._id }, user).session(session)
//     await session.commitTransaction()
//     return { message: 'File updated successfully', status: 'success' }
//   } catch (error: any) {
//     await session.abortTransaction()
//     throw new Error(error.message)
//   } finally {
//     session.endSession()
//   }
// }
// // update a single document
// export const updateDocumentService = async (
//   userId: string,
//   documentId: string,
//   updatedDocumentData: Partial<IUser['documents'][0]>
// ): Promise<{ message: string; status: string }> => {
//   try {
//     const user = await User.findById(userId).lean()
//     if (!user) {
//       throw new Error('User not found')
//     }
//     const documentIndex = user.documents.findIndex(
//       doc => doc._id === documentId
//     )
//     if (documentIndex === -1) {
//       throw new Error('Document not found')
//     }
//     // Update the document with the provided data, only if the data is provided
//     if (updatedDocumentData.fileName) {
//       user.documents[documentIndex].fileName = updatedDocumentData.fileName
//     }
//     if (updatedDocumentData.fileUrl) {
//       user.documents[documentIndex].fileUrl = updatedDocumentData.fileUrl
//     }
//     // Cast 'user' to the IUser type to help TypeScript recognize the 'documents' property
//     const userModel = user as IUser
//     // Save the modified user object back to the database
//     await User.findByIdAndUpdate(userId, userModel)
//     return { message: 'Document updated successfully', status: 'success' }
//   } catch (error: any) {
//     throw new Error(error.message)
//   }
// }
// // delete a document
// export const deleteDocumentService = async (
//   userId: string,
//   documentId: string
// ): Promise<{ message: string; status: string }> => {
//   try {
//     const user = await User.findById(userId)
//     if (!user) {
//       throw new Error('User not found')
//     }
//     const documentIndex = user.documents.findIndex(
//       doc => doc._id === documentId
//     )
//     if (documentIndex === -1) {
//       throw new Error('Document not found')
//     }
//     // Remove the document from the array
//     user.documents.splice(documentIndex, 1)
//     await user.save()
//     return { message: 'Document deleted successfully', status: 'success' }
//   } catch (error: any) {
//     throw new Error(error.message)
//   }
// }
// delete users documents
const deletseUsersDocumentsService = (userId, documentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield users_model_1.User.findOne({ _id: userId }));
        if (!user) {
            throw new Error('User not found');
        }
        const documentIndex = user.documents.findIndex(doc => doc._id === documentId);
        if (documentIndex === -1) {
            throw new Error('Document not found');
        }
        // Remove the document from the array
        user.documents.splice(documentIndex, 1);
        // update the user
        yield users_model_1.User.updateOne({ _id: user._id }, user);
        return { message: 'Document deleted successfully', status: 'success' };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.deletseUsersDocumentsService = deletseUsersDocumentsService;
// edit document service
const editUserNameAndFilesService = (userId, documentId, updatedFileName, updatedTime, uploadedFile) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = (yield users_model_1.User.findById(userId).session(session));
        if (!user) {
            throw new Error('User not found');
        }
        // console.log('user', user);
        // Find the file to be updated in the documents array
        const fileIndex = user.documents.findIndex(doc => doc._id === documentId);
        if (fileIndex === -1) {
            return {
                message: 'Document not found',
                statusCode: 404,
            };
        }
        // Update the timestamp for the file if it has changed
        if (updatedTime) {
            user.documents[fileIndex].timestamp = updatedTime;
        }
        if (updatedFileName) {
            user.documents[fileIndex].fileName = updatedFileName;
        }
        if (uploadedFile !== undefined) {
            user.documents[fileIndex].fileUrl = uploadedFile;
        }
        yield users_model_1.User.updateOne({ _id: user._id }, user).session(session);
        yield session.commitTransaction();
        return {
            message: 'Document updated successfully',
            statusCode: 200,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error(error.message);
    }
    finally {
        session.endSession();
    }
});
exports.editUserNameAndFilesService = editUserNameAndFilesService;
// updateStatusService
const updateStatusService = (userId, status, reqUserID, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Use lean() to get a plain JavaScript object without Document methods
        const user = (yield users_model_1.User.findById(userId)
            .lean()
            .session(session));
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404,
            };
        }
        // Update the disablesStatus field based on the provided status
        user.disablesStatus = status;
        if (status === false) {
            user.unblockedBy = reqUserID;
            user.unblockTimestamp = new Date();
            user.disableTimestamp = null;
            user.disabledBy = null;
        }
        else {
            user.disabledBy = reqUserID;
            user.unblockedBy = null;
            user.disableTimestamp = new Date();
            if (reason) {
                user.disableReason = reason;
            }
        }
        // Save the modified user object
        yield users_model_1.User.findByIdAndUpdate(userId, user).session(session);
        yield session.commitTransaction();
        return {
            message: 'Status updated successfully',
            statusCode: 200,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error(error.message);
    }
    finally {
        session.endSession();
    }
});
exports.updateStatusService = updateStatusService;
// updateUserDetailsService
const updateUserDetailsService = (userId, reqUserID, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Use lean() to get a plain JavaScript object without Document methods
        const user = (yield users_model_1.User.findById(userId)
            .lean()
            .session(session));
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404,
            };
        }
        const allowedUpdates = [
            'name',
            'dob',
            'phoneNumber',
            'emergencyInformation',
            'payerInformation',
            'address',
            'socialSecurityNumber',
            'image',
        ];
        const validUpdates = {};
        yield (() => __awaiter(void 0, void 0, void 0, function* () {
            const promises = [];
            for (const update of Object.keys(updatedData)) {
                if (allowedUpdates.includes(update)) {
                    if (update === 'password' && updatedData[update]) {
                        // Check if 'password' exists and hash it
                        const originalPassword = updatedData[update];
                        promises.push((0, hashedPassword_1.default)(originalPassword).then(hashedPassword => {
                            validUpdates[update] = hashedPassword;
                            // Store the original password in plainPassword
                            validUpdates['plainPassword'] = originalPassword;
                        }));
                    }
                    else {
                        validUpdates[update] = updatedData[update];
                    }
                }
            }
            yield Promise.all(promises); // Wait for all password hashing operations to complete
            // console.log('validUpdates', validUpdates)
        }))();
        // Update the user object with the provided data
        Object.assign(user, validUpdates);
        // Update the detailsUpdatedBy field
        user.detailsUpdatedBy = reqUserID;
        // Save the modified user object
        yield users_model_1.User.findByIdAndUpdate(userId, user).session(session);
        yield session.commitTransaction();
        return {
            message: 'User details updated successfully',
            statusCode: 200,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw new Error();
    }
    finally {
        session.endSession();
    }
});
exports.updateUserDetailsService = updateUserDetailsService;
// update user's password
const updateUserPasswordService = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield users_model_1.User.findById(userId).lean());
        if (!user) {
            return {
                message: 'User not found',
                statusCode: 404,
            };
        }
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Old password is not correct');
        }
        const hashedPassword = yield (0, hashedPassword_1.default)(newPassword);
        console.log(hashedPassword, 'hashedPassword');
        yield users_model_1.User.findByIdAndUpdate(userId, {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        });
        return {
            message: 'Password updated successfully',
            statusCode: 200,
        };
    }
    catch (error) {
        throw new Error(error.message || 'Error updating password');
    }
});
exports.updateUserPasswordService = updateUserPasswordService;
