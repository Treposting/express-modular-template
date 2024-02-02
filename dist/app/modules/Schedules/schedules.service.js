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
exports.deleteExcludedWeeksService = exports.updateExcludedDatesService = exports.getSingleScheduleService = exports.deleteOrganizationScheduleService = exports.deleteScheduleService = exports.editScheduleStatusService = exports.updateCaregiverAssignmentsService = exports.editScheduleService = exports.getClientsSchedules = exports.getCaregiversSchedules = exports.getAllSchedulesService = exports.createSchedulesService = void 0;
const bson_1 = require("bson");
const mongoose_1 = __importDefault(require("mongoose"));
const validateExcludedWeeks_1 = require("../../../utils/validateExcludedWeeks");
const schedules_model_1 = require("./schedules.model");
const createSchedulesService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduleData = __rest(data, []);
    const newdata = Object.assign({}, scheduleData);
    const newSchedule = yield schedules_model_1.Schedule.create(newdata);
    return newSchedule;
});
exports.createSchedulesService = createSchedulesService;
// export const getAllSchedulesService = async (
//   startDate: Date | null,
//   endDate: Date | null,
//   scheduleType: 'daily' | 'weekly' | 'monthly' | null,
//   time: string | null,
//   shiftType: 'shift' | 'visit' | null
// ): Promise<ISchedule[]> => {
//   const query: Record<string, any> = {}
//   if (startDate && endDate) {
//     query.startDate = { $gte: startDate, $lte: endDate }
//   }
//   if (scheduleType) {
//     query.scheduleType = scheduleType
//   }
//   if (time) {
//     query.startTime = { $lte: time }
//     query.endTime = { $gte: time }
//   }
//   if (shiftType) {
//     query.shiftType = shiftType
//   }
//   return Schedule.find(query)
//     .populate({
//       path: 'caregiver',
//       select: 'firstName lastName email address image',
//     })
//     .populate({
//       path: 'organization',
//       select: 'name address email phone',
//     })
//     .populate({
//       path: 'createdBy',
//       select: 'firstName lastName email address image role',
//     })
// }
// export const getAllSchedulesService = async (
//   organization: string
// ): Promise<ISchedule> => {
//   // get schedule for a particular organization
//   // console.log(organization)
//   const schedules = await Schedule.findOne({ organization })
//   // console.log(schedules)
//   return schedules as ISchedule
// }
const getAllSchedulesService = (organizationId, shiftType, scheduleType, date, caregiverId, clientId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define filters based on the query parameters
        const filters = {};
        if (organizationId) {
            filters.organization = new bson_1.ObjectId(organizationId);
        }
        if (shiftType) {
            filters.shiftType = shiftType;
        }
        if (scheduleType) {
            filters.scheduleType = scheduleType;
        }
        if (date) {
            filters.startDate = { $lte: new Date(date) };
            filters.endDate = { $gte: new Date(date) };
        }
        // if (caregiverId) {
        //   filters['caregiverAssignments.caregiverId'] = new ObjectId(caregiverId);
        // }
        if (caregiverId) {
            // Dynamic filter for caregiverAssignments
            filters['caregiverAssignments'] = {
                $elemMatch: { caregiverId: new bson_1.ObjectId(caregiverId) },
            };
        }
        if (clientId) {
            filters.clientId = new bson_1.ObjectId(clientId);
        }
        // console.log('filters', filters);
        // Convert page and limit to integers
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        // Calculate skip based on page number and limit
        const skip = (pageNumber - 1) * limitNumber;
        // Fetch schedules based on the filters with pagination
        const schedules = yield schedules_model_1.Schedule.find(filters)
            .skip(skip)
            .limit(limitNumber)
            .sort({ startDate: -1 })
            .populate('clientId', 'name email phoneNumber address emergencyInformation')
            .populate({
            path: 'caregiverAssignments.caregiverId',
            select: 'name email image phoneNumber',
        })
            .populate('organization', 'name');
        // Count total number of schedules without pagination
        console.log('filters', filters);
        const totalSchedules = yield schedules_model_1.Schedule.countDocuments(filters);
        // Construct metadata for pagination
        const paginationMeta = {
            page: pageNumber,
            limit: limitNumber,
            total: totalSchedules,
        };
        // Return schedules and pagination metadata
        return {
            data: schedules,
            meta: paginationMeta,
        };
    }
    catch (error) {
        throw new Error('Failed to retrieve schedules.');
    }
});
exports.getAllSchedulesService = getAllSchedulesService;
const getCaregiversSchedules = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('filters', filters);
    let query = {
        'caregiverAssignments.caregiverId': new bson_1.ObjectId(filters.caregiverId),
        isActive: { $ne: false },
    };
    if (filters.startDate && filters.endDate) {
        query = Object.assign(Object.assign({}, query), { $and: [
                { startDate: { $gte: filters.startDate } },
                { startDate: { $lte: filters.endDate } },
            ] });
    }
    else if (filters.startDate) {
        query = Object.assign(Object.assign({}, query), { startDate: {
                $gte: filters.startDate,
                $lte: filters.startDate + 'T23:59:59.999Z',
            } });
    }
    if (filters.month) {
        const startOfMonth = new Date(filters.month);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Adding one month
        endOfMonth.setSeconds(endOfMonth.getSeconds() - 1); // Setting the last second of the last day of the month
        // Combine with existing query conditions using $and
        query = Object.assign(Object.assign({}, query), { $and: [
                { startDate: { $gte: startOfMonth.toISOString() } },
                { startDate: { $lte: endOfMonth.toISOString() } },
            ] });
    }
    // console.log('query', query)
    const result = yield schedules_model_1.Schedule.find(query)
        .sort({ startDate: -1 })
        .populate('clientId', 'name email address dob socialSecurityNumber image phoneNumber emergencyInformation')
        .populate({
        path: 'caregiverAssignments.caregiverId',
        select: 'name email image phoneNumber',
    });
    return result;
});
exports.getCaregiversSchedules = getCaregiversSchedules;
const getClientsSchedules = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
        clientId: new bson_1.ObjectId(filters.clientId),
        isActive: { $ne: false },
    };
    if (filters.startDate && filters.endDate) {
        query = Object.assign(Object.assign({}, query), { $and: [
                { startDate: { $gte: filters.startDate } },
                { startDate: { $lte: filters.endDate } },
            ] });
    }
    else if (filters.startDate) {
        query = Object.assign(Object.assign({}, query), { startDate: {
                $gte: filters.startDate,
                $lte: filters.startDate + 'T23:59:59.999Z',
            } });
    }
    if (filters.month) {
        const startOfMonth = new Date(filters.month);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Adding one month
        endOfMonth.setSeconds(endOfMonth.getSeconds() - 1); // Setting the last second of the last day of the month
        // Combine with existing query conditions using $and
        query = Object.assign(Object.assign({}, query), { $and: [
                { startDate: { $gte: startOfMonth.toISOString() } },
                { startDate: { $lte: endOfMonth.toISOString() } },
            ] });
    }
    const result = yield schedules_model_1.Schedule.find(query)
        .populate({
        path: 'clientId',
        select: 'name email address dob socialSecurityNumber image phoneNumber emergencyInformation',
    })
        .populate({
        path: 'caregiverAssignments.caregiverId',
        select: 'name email image phoneNumber',
    });
    return result;
});
exports.getClientsSchedules = getClientsSchedules;
const editScheduleService = (schedule, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { scheduleId, caregiverAssignments, clientId } = schedule, data = __rest(schedule, ["scheduleId", "caregiverAssignments", "clientId"]);
        const updatedBy = user._id;
        // Check if the schedule exists
        const existingSchedule = yield schedules_model_1.Schedule.findOne({
            _id: scheduleId,
        }).session(session);
        if (!existingSchedule) {
            throw new Error("Schedule doesn't exist");
        }
        // Update the schedule with the new data and updatedBy field
        const updatedSchedule = yield schedules_model_1.Schedule.findOneAndUpdate({ _id: scheduleId }, {
            $set: Object.assign(Object.assign({}, data), { updatedBy: updatedBy }),
        }, { new: true, session });
        // If everything is successful, commit the transaction
        yield session.commitTransaction();
        session.endSession();
        // console.log('-----updated schedule-----', updatedSchedule)
        return updatedSchedule;
    }
    catch (error) {
        // If any error occurs, rollback the transaction
        yield session.abortTransaction();
        session.endSession();
        throw error; // Rethrow the error to indicate the failure
    }
});
exports.editScheduleService = editScheduleService;
// export const editScheduleService = async (
//   schedule: ISchedule,
//   user: any
// ): Promise<ISchedule | null> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { scheduleId, caregiverAssignments, clientId, ...data } = schedule;
//     const updatedBy = user._id;
//     // Check if the schedule exists
//     const existingSchedule = await Schedule.findOne({
//       _id: scheduleId,
//     }).session(session);
//     if (!existingSchedule) {
//       throw new Error("Schedule doesn't exist");
//     }
//     // Update the schedule with the new data and updatedBy field
//     let updatedSchedule;
//     if (caregiverAssignments && caregiverAssignments.length > 0) {
//       // Check if the caregiver exists
//       const existingCaregiver = await User.findOne({
//         _id: caregiverAssignments[0].caregiverId, // Assuming caregiverId is in the first assignment
//       }).session(session);
//       if (!existingCaregiver) {
//         throw new Error("Caregiver doesn't exist");
//       }
//       if (clientId) {
//         // Check if the client exists
//         const existingClient = await User.findOne({
//           _id: clientId,
//         }).session(session);
//         if (!existingClient) {
//           throw new Error("Client doesn't exist");
//         }
//       }
//       // Update the schedule with the new data, caregiver, client, and updatedBy field
//       updatedSchedule = await Schedule.findOneAndUpdate(
//         { _id: scheduleId },
//         {
//           $set: { ...data, caregiverAssignments, clientId, updatedBy: updatedBy },
//         },
//         { new: true, session }
//       );
//     } else {
//       // Update the schedule with the new data and updatedBy field without checking caregiver and client
//       updatedSchedule = await Schedule.findOneAndUpdate(
//         { _id: scheduleId },
//         {
//           $set: { ...data, caregiverAssignments, updatedBy: updatedBy },
//         },
//         { new: true, session }
//       );
//     }
//     // If everything is successful, commit the transaction
//     await session.commitTransaction();
//     session.endSession();
//     return updatedSchedule;
//   } catch (error) {
//     // If any error occurs, rollback the transaction
//     await session.abortTransaction();
//     session.endSession();
//     throw error; // Rethrow the error to indicate the failure
//   }
// };
// edit schedule status
// update schedule caregiversiverAssignments
// export const updateCaregiverAssignmentsService = async (
//   scheduleId: string,
//   caregiverAssignments: any[], // Assuming caregiverAssignments is an array of assignments
//   updatedBy: string
// ): Promise<ISchedule | null> => {
//   const session = await mongoose.startSession()
//   session.startTransaction()
//   try {
//     const schedule = await Schedule.findOne({ _id: scheduleId }).session(
//       session
//     )
//     if (!schedule) {
//       throw new Error('Schedule not found')
//     }
//     const existingAssignments = schedule.caregiverAssignments || []
//     for (const assignment of caregiverAssignments) {
//       const { caregiverId, startDate, endDate, _id, isDelete } = assignment
//       // Validate if the caregiver is already assigned during the specified period
//       const conflictingAssignment = existingAssignments.find(
//         a =>
//           a.caregiverId.toString() === caregiverId &&
//           ((startDate >= a.startDate && startDate <= a.endDate) ||
//             (endDate >= a.startDate && endDate <= a.endDate))
//       )
//       if (conflictingAssignment) {
//         throw new Error(
//           `Caregiver is already assigned during the specified period: ${conflictingAssignment.startDate} to ${conflictingAssignment.endDate}`
//         )
//       }
//       if (isDelete) {
//         // Handle deletion
//         const updatedAssignments = existingAssignments.filter(
//           a => a._id?.toString() !== _id
//         )
//         await Schedule.updateOne(
//           { _id: scheduleId },
//           {
//             $set: {
//               caregiverAssignments: updatedAssignments,
//               updatedBy: updatedBy,
//             },
//           }
//         ).session(session)
//       } else {
//         // Handle addition or update
//         const updatedAssignments = isDelete
//           ? existingAssignments
//           : [...existingAssignments, assignment]
//         await Schedule.updateOne(
//           { _id: scheduleId },
//           {
//             $set: {
//               caregiverAssignments: updatedAssignments,
//               updatedBy: updatedBy,
//             },
//           }
//         ).session(session)
//       }
//     }
//     await session.commitTransaction()
//     session.endSession()
//     const updatedSchedule = await Schedule.findOne({ _id: scheduleId })
//     return updatedSchedule
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }
// export const updateCaregiverAssignmentsService = async (
//   scheduleId: string,
//   caregiverAssignments: any[], // Assuming caregiverAssignments is an array of assignments
//   updatedBy: string
// ): Promise<ISchedule | null> => {
//   const session = await mongoose.startSession()
//   session.startTransaction()
//   try {
//     const schedule = await Schedule.findOne({ _id: scheduleId }).session(
//       session
//     )
//     if (!schedule) {
//       throw new Error('Schedule not found')
//     }
//     const existingAssignments = schedule.caregiverAssignments || []
//     for (const assignment of caregiverAssignments) {
//       const { caregiverId, startDate, endDate, _id, isDelete } = assignment
//       // Handle deletion first
//       if (isDelete) {
//         const updatedAssignments = existingAssignments.filter(
//           a => a._id?.toString() !== _id
//         )
//         await Schedule.updateOne(
//           { _id: scheduleId },
//           {
//             $set: {
//               caregiverAssignments: updatedAssignments,
//               updatedBy: updatedBy,
//             },
//           }
//         ).session(session)
//         continue // Skip validation for deleted assignments
//       }
//       // Validate if the caregiver is already assigned during the specified period
//       const conflictingAssignment = existingAssignments.find(
//         a =>
//           a.caregiverId.toString() === caregiverId &&
//           a._id?.toString() !== _id &&
//           !(
//             new Date(endDate) < new Date(a.startDate) ||
//             new Date(startDate) > new Date(a.endDate)
//           )
//       )
//       if (conflictingAssignment) {
//         throw new Error(
//           `Caregiver is already assigned during the specified period: ${conflictingAssignment.startDate} to ${conflictingAssignment.endDate}`
//         )
//       }
//       // Handle addition or update
//       const updatedAssignments = [...existingAssignments, assignment]
//       await Schedule.updateOne(
//         { _id: scheduleId },
//         {
//           $set: {
//             caregiverAssignments: updatedAssignments,
//             updatedBy: updatedBy,
//           },
//         }
//       ).session(session)
//     }
//     await session.commitTransaction()
//     session.endSession()
//     const updatedSchedule = await Schedule.findOne({ _id: scheduleId })
//     return updatedSchedule
//   } catch (error) {
//     await session.abortTransaction()
//     session.endSession()
//     throw error
//   }
// }
const updateCaregiverAssignmentsService = (scheduleId, caregiverAssignments, // Assuming caregiverAssignments is an array of assignments
updatedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const schedule = yield schedules_model_1.Schedule.findOne({ _id: scheduleId }).session(session);
            if (!schedule) {
                throw new Error('Schedule not found');
            }
            const existingAssignments = schedule.caregiverAssignments || [];
            for (const assignment of caregiverAssignments) {
                const { caregiverId, startDate, endDate, _id, isDelete, updatedAt } = assignment;
                if (isDelete) {
                    const updatedAssignments = existingAssignments.filter(a => { var _a; return ((_a = a._id) === null || _a === void 0 ? void 0 : _a.toString()) !== _id; });
                    yield schedules_model_1.Schedule.updateOne({ _id: scheduleId }, {
                        $set: {
                            caregiverAssignments: updatedAssignments,
                            updatedBy: updatedBy,
                        },
                    }).session(session);
                    continue;
                }
                const conflictingAssignment = yield schedules_model_1.Schedule.findOne({
                    _id: scheduleId,
                    'caregiverAssignments.caregiverId': caregiverId,
                    $or: [
                        {
                            'caregiverAssignments._id': { $ne: _id },
                            'caregiverAssignments.startDate': {
                                $lt: new Date(endDate),
                                $gte: new Date(startDate),
                            },
                        },
                        {
                            'caregiverAssignments._id': { $ne: _id },
                            'caregiverAssignments.endDate': {
                                $gt: new Date(startDate),
                                $lte: new Date(endDate),
                            },
                        },
                    ],
                }).session(session);
                if (conflictingAssignment) {
                    throw new Error(`Caregiver is already assigned during the specified period: ${conflictingAssignment.caregiverAssignments[0].startDate} to ${conflictingAssignment.caregiverAssignments[0].endDate}`);
                }
                const index = existingAssignments.findIndex(a => { var _a; return ((_a = a._id) === null || _a === void 0 ? void 0 : _a.toString()) === _id; });
                if (index !== -1) {
                    // Update existing assignment without modifying updatedAt
                    existingAssignments[index] = Object.assign({}, assignment);
                }
                else {
                    // Add new assignment with custom updatedAt
                    existingAssignments.push(Object.assign(Object.assign({}, assignment), { updatedAt: new Date() }));
                }
                yield schedules_model_1.Schedule.updateOne({ _id: scheduleId }, {
                    $set: {
                        caregiverAssignments: existingAssignments,
                        updatedBy: updatedBy,
                    },
                }).session(session);
            }
        }));
        session.endSession();
        const updatedSchedule = yield schedules_model_1.Schedule.findOne({ _id: scheduleId });
        return updatedSchedule;
    }
    catch (error) {
        yield session.endSession();
        throw error;
    }
});
exports.updateCaregiverAssignmentsService = updateCaregiverAssignmentsService;
const editScheduleStatusService = (scheduleId, userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield schedules_model_1.Schedule.findOneAndUpdate({ _id: scheduleId }, {
            $set: { isActive: status, updatedBy: userId },
        }, { new: true });
        return schedule;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.editScheduleStatusService = editScheduleStatusService;
// delete schedule
const deleteScheduleService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield schedules_model_1.Schedule.findByIdAndDelete(id);
    if (!schedule) {
        throw new Error('Schedule not found');
    }
    return schedule;
});
exports.deleteScheduleService = deleteScheduleService;
// delete schedule
const deleteOrganizationScheduleService = (orId) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield schedules_model_1.Schedule.deleteMany({ organization: orId });
    if (!schedule) {
        throw new Error('No Schedule found');
    }
    return schedule;
});
exports.deleteOrganizationScheduleService = deleteOrganizationScheduleService;
// getSingleScheduleService
const getSingleScheduleService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield schedules_model_1.Schedule.findById(id)
        .populate('clientId', 'name email address dob socialSecurityNumber image phoneNumber emergencyInformation')
        .populate({
        path: 'caregiverAssignments.caregiverId',
        select: 'name email image phoneNumber',
    })
        .populate('organization', 'name address email phone')
        .populate('createdBy', 'name email address image role')
        .populate('updatedBy', 'name email address image role');
    if (!schedule) {
        throw new Error('Schedule not found');
    }
    return schedule;
});
exports.getSingleScheduleService = getSingleScheduleService;
// updateExcludedDatesService
const updateExcludedDatesService = (scheduleId, excludedWeeks) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the schedule exists
        const existingSchedule = yield schedules_model_1.Schedule.findById(scheduleId);
        // Throw an error if the schedule is not found
        if (!existingSchedule) {
            throw new Error('Schedule not found');
        }
        // Convert excludedWeeks to an array if it's an object or not iterable
        const excludedWeeksArray = Array.isArray(excludedWeeks)
            ? excludedWeeks
            : excludedWeeks
                ? [excludedWeeks]
                : [];
        // Remove old ranges that are completely covered by the new range
        existingSchedule.excludedWeeks = existingSchedule.excludedWeeks.filter(existingRange => !excludedWeeksArray.some(newRange => (0, validateExcludedWeeks_1.isRangeCovered)(existingRange, newRange)));
        // Check if there are overlapping intervals
        const overlappingIndex = (0, validateExcludedWeeks_1.findOverlappingInterval)(existingSchedule.excludedWeeks, excludedWeeksArray);
        if (overlappingIndex !== -1) {
            // Overlapping interval found, update the existing one
            const updatedRange = (0, validateExcludedWeeks_1.mergeRanges)(existingSchedule.excludedWeeks[overlappingIndex], excludedWeeksArray[0]);
            existingSchedule.excludedWeeks[overlappingIndex] = updatedRange;
        }
        else {
            // No overlapping interval found, add the new one
            existingSchedule.excludedWeeks =
                existingSchedule.excludedWeeks.concat(excludedWeeksArray);
        }
        // Save the updated schedule
        const updatedSchedule = yield existingSchedule.save();
        // Return the updated schedule
        return updatedSchedule;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.updateExcludedDatesService = updateExcludedDatesService;
// Assuming ExcludedWeekDocument is the correct type with _id
const deleteExcludedWeeksService = (scheduleId, excludedWeeksId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the schedule exists
        const existingSchedule = yield schedules_model_1.Schedule.findById(scheduleId);
        // Throw an error if the schedule is not found
        if (!existingSchedule) {
            throw new Error('Schedule not found');
        }
        console.log('scheduleId:', scheduleId);
        console.log('excludedWeeksId:', excludedWeeksId);
        console.log('Before removal:', existingSchedule.excludedWeeks);
        // Validate that excludedWeeksId is a valid ObjectId
        if (!bson_1.ObjectId.isValid(excludedWeeksId)) {
            throw new Error('Invalid excludedWeeksId format');
        }
        // Find the index of the excluded date range with the provided _id
        const indexOfExcludedWeeks = existingSchedule.excludedWeeks.findIndex((excludedWeek) => excludedWeek._id.toString() === excludedWeeksId);
        // Throw an error if the excludedWeeksId is not found
        if (indexOfExcludedWeeks === -1) {
            throw new Error('Excluded date range not found');
        }
        // Remove the excluded date range from the array
        existingSchedule.excludedWeeks.splice(indexOfExcludedWeeks, 1);
        // Save the updated schedule
        yield existingSchedule.save();
    }
    catch (error) {
        throw new Error(`Failed to delete excluded date range: ${error.message}`);
    }
});
exports.deleteExcludedWeeksService = deleteExcludedWeeksService;
