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
exports.revertDeletionsService = exports.deleteOrganizationsService = exports.updateSingleOrganizationService = exports.getSingleOrganizationService = exports.updateOrganizationStatusService = exports.getAllOrganizationsService = exports.createOrganizationService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginate_1 = require("../../../middlewares/paginate");
const History_model_1 = require("../History/History.model");
const schedules_model_1 = require("../Schedules/schedules.model");
const users_model_1 = require("../Users/users.model");
const Organization_constant_1 = require("./Organization.constant");
const Organization_model_1 = __importDefault(require("./Organization.model"));
const createOrganizationService = (orgInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Organization_model_1.default.create(orgInfo);
    return result;
});
exports.createOrganizationService = createOrganizationService;
const getAllOrganizationsService = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder, skipLimit, organization } = paginate_1.paginationHelpers.calculatePagination(paginationOptions);
    // console.log(organization, 'organization')
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: Organization_constant_1.orgSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
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
        const result = yield Organization_model_1.default.find(whereConditions)
            .sort(sortConditions)
            .lean();
        const total = yield Organization_model_1.default.countDocuments(whereConditions);
        const organizationsWithUserCount = result.map(org => {
            const usersCount = org.users ? org.users.length : 0;
            return Object.assign(Object.assign({}, org), { usersCount });
        });
        return {
            meta: {
                page: 1,
                limit: total,
                total,
            },
            data: organizationsWithUserCount,
        };
    }
    else {
        // Apply pagination as usual with skip and limit while using .lean().
        const result = yield Organization_model_1.default.find(whereConditions)
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean();
        const total = yield Organization_model_1.default.countDocuments(whereConditions);
        const organizationsWithUserCount = result.map(org => {
            const usersCount = org.users ? org.users.length : 0;
            return Object.assign(Object.assign({}, org), { usersCount });
        });
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: organizationsWithUserCount,
        };
    }
});
exports.getAllOrganizationsService = getAllOrganizationsService;
// updateOrganizationStatusService
const updateOrganizationStatusService = (orgId, status, reqUserID, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Use lean() to get a plain JavaScript object without Document methods
        const Organization = (yield Organization_model_1.default.findById(orgId)
            .lean()
            .session(session));
        if (!Organization) {
            throw new Error('Organization not found');
        }
        // console.log('Organization', Organization)
        // Update the disablesStatus field based on the provided status
        Organization.organizationStatus = status;
        if (status === false) {
            // false for disable
            Organization.unblockedBy = null;
            Organization.unblockTimestamp = null;
            Organization.disableTimestamp = new Date();
            Organization.disabledBy = reqUserID;
        }
        else {
            // true for enable
            Organization.disabledBy = null;
            Organization.unblockedBy = reqUserID;
            Organization.unblockTimestamp = new Date();
            Organization.disableTimestamp = null;
            if (reason) {
                Organization.disableReason = reason;
            }
        }
        // Save the modified user object
        yield Organization_model_1.default.findByIdAndUpdate(orgId, Organization).session(session);
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
exports.updateOrganizationStatusService = updateOrganizationStatusService;
//getSingleOrganizationService
const getSingleOrganizationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Organization_model_1.default.findById(id).populate('users', 'name email role status');
    if (!result) {
        throw new Error('Organization not found');
    }
    return result;
});
exports.getSingleOrganizationService = getSingleOrganizationService;
// updateSingleOrganizationService
const updateSingleOrganizationService = (id, orgInfo, reqUserID) => __awaiter(void 0, void 0, void 0, function* () {
    // check if organization exists
    const orgData = yield Organization_model_1.default.findById(id).lean().exec();
    if (!orgData) {
        throw new Error('Organization not found');
    }
    const { users, organizationStatus } = orgInfo, data = __rest(orgInfo
    // update organization information, also update the updatedBy field
    , ["users", "organizationStatus"]);
    // update organization information, also update the updatedBy field
    const result = yield Organization_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { updatedBy: reqUserID }), { new: true }).lean();
    return result;
});
exports.updateSingleOrganizationService = updateSingleOrganizationService;
// delete organization's all information regarding user, schedules
const deleteOrganizationsService = (id, reqUserID) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the organization
        const organization = yield Organization_model_1.default.findById(id).lean();
        // If the organization doesn't exist, throw an error
        if (!organization) {
            throw new Error('Organization not found');
        }
        // Find and delete all users associated with the organization
        const deletedUsers = yield users_model_1.User.deleteMany({
            organization: id,
        }).session(session);
        // Find and delete all schedules associated with the organization
        const deletedSchedules = yield schedules_model_1.Schedule.deleteMany({
            organization: id,
        }).session(session);
        const historyData = yield History_model_1.HistoricalDataModel.create({
            organization,
            users: deletedUsers.deletedCount
                ? yield users_model_1.User.find({ organization: id }).lean()
                : [],
            schedules: deletedSchedules.deletedCount
                ? yield schedules_model_1.Schedule.find({ organization: id }).lean()
                : [],
        });
        console.log(historyData._id);
        // Now, delete the organization itself
        yield Organization_model_1.default.findByIdAndDelete(id).session(session);
        // Use findOneAndUpdate with { new: true } to get the updated document
        const updateResult = yield History_model_1.HistoricalDataModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(historyData._id),
        });
        // console.log(updateResult)
        if (!updateResult) {
            throw new Error('No historical data found for the organization');
        }
        // update the deletedBy and deletedAt field
        updateResult.deletedBy = reqUserID;
        updateResult.deletedAt = new Date();
        // Save the updated document
        yield updateResult.save();
        // Commit the transaction
        yield session.commitTransaction();
        return {
            organization: organization,
            deletedUsers: deletedUsers.deletedCount,
            deletedSchedules: deletedSchedules.deletedCount,
        };
    }
    catch (error) {
        // An error occurred, rollback the transaction
        yield session.abortTransaction();
        throw error; // Rethrow the error for the caller to handle
    }
    finally {
        session.endSession();
    }
});
exports.deleteOrganizationsService = deleteOrganizationsService;
// revert the organization's all information regarding user, schedules
const revertDeletionsService = (id, reqUserID) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        console.log('id', id);
        // Find historical data for the specified organization
        const historicalData = yield History_model_1.HistoricalDataModel.findOne({
            'organization._id': new mongoose_1.default.Types.ObjectId(id),
        })
            .populate('organization')
            .populate('users')
            .populate('schedules')
            .lean();
        if (!historicalData) {
            throw new Error('No historical data found for the organization');
        }
        // console.log('historicalData', historicalData._id)
        if (historicalData.restoredAt) {
            throw new Error('Organization already restored');
        }
        // Revert deleted organization
        const createdOrganizationArray = yield Organization_model_1.default.create([historicalData.organization], // Wrap the organization in an array
        { session });
        const restoredOrganization = createdOrganizationArray.map(createdOrganization => createdOrganization.toObject());
        // Revert deleted users
        const restoredUsers = yield Promise.all((historicalData.users || []).map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield users_model_1.User.create([user], { session });
            return createdUser[0].toObject(); // Convert Mongoose document to plain object
        })));
        // Revert deleted schedules
        const restoredSchedules = yield Promise.all((historicalData.schedules || []).map((schedule) => __awaiter(void 0, void 0, void 0, function* () {
            const createdSchedule = yield schedules_model_1.Schedule.create([schedule], {
                session,
            });
            return createdSchedule[0].toObject(); // Convert Mongoose document to plain object
        })));
        // Use findOneAndUpdate with { new: true } to get the updated document
        const updateResult = yield History_model_1.HistoricalDataModel.findOne({
            _id: new mongoose_1.default.Types.ObjectId(historicalData._id),
        });
        // console.log(updateResult)
        if (!updateResult) {
            throw new Error('No historical data found for the organization');
        }
        // update the deletedBy and deletedAt field
        updateResult.restoredBy = reqUserID;
        updateResult.restoredAt = new Date();
        // Save the updated document
        yield updateResult.save();
        // Commit the transaction
        yield session.commitTransaction();
        return {
            restoredOrganization,
            restoredUsers,
            restoredSchedules,
        };
    }
    catch (error) {
        // An error occurred, rollback the transaction
        yield session.abortTransaction();
        throw error; // Rethrow the error for the caller to handle
    }
    finally {
        session.endSession();
    }
});
exports.revertDeletionsService = revertDeletionsService;
