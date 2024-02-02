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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThisMonthStatisticsService = exports.getSevenDaysStatisticsService = void 0;
const schedules_model_1 = require("../Schedules/schedules.model");
const getSevenDaysStatisticsService = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    try {
        // Find schedules within the past seven days
        const schedules = yield schedules_model_1.Schedule.find({
            organization: orgId,
            startDate: { $gte: sevenDaysAgo },
        });
        // Calculate the total schedule hours
        let totalScheduleHours = 0;
        schedules.forEach(schedule => {
            try {
                if (schedule.startTime && schedule.endTime) {
                    const startTimeComponents = schedule.startTime.split(' ');
                    const endTimeComponents = schedule.endTime.split(' ');
                    // Get the start and end times in 24-hour format
                    const startTime = startTimeComponents[1] === 'am'
                        ? parseInt(startTimeComponents[0])
                        : parseInt(startTimeComponents[0]) + 12;
                    const endTime = endTimeComponents[1] === 'am'
                        ? parseInt(endTimeComponents[0])
                        : parseInt(endTimeComponents[0]) + 12;
                    // Calculate the time difference
                    let timeDiff = endTime - startTime;
                    if (timeDiff < 0) {
                        timeDiff = timeDiff + 12;
                    }
                    // Add the time difference to the total schedule hours
                    totalScheduleHours += timeDiff;
                }
                else {
                    // Handle schedules without valid startTime or endTime
                    console.warn('Schedule without valid startTime or endTime:', schedule);
                }
            }
            catch (error) {
                // console.error('Error calculating schedule hours:', error)
                // Handle the error as needed
            }
        });
        const schedulesCount = schedules.length;
        const shiftsCount = schedules.filter(schedule => schedule.shiftType === 'shift').length;
        const timeFramesCount = schedules.filter(schedule => schedule.timeFrame !== '').length;
        return {
            orgId,
            schedulesCount,
            shiftsCount,
            timeFramesCount,
            totalScheduleHours: totalScheduleHours || 0,
        };
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Error fetching statistics');
    }
});
exports.getSevenDaysStatisticsService = getSevenDaysStatisticsService;
const getThisMonthStatisticsService = (orgId) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set the date to the 1st of the month
    try {
        // Find schedules within the current month
        const schedules = yield schedules_model_1.Schedule.find({
            organization: orgId,
            startDate: { $gte: startOfMonth },
        });
        // Calculate the total schedule hours
        let totalScheduleHours = 0;
        schedules.forEach(schedule => {
            try {
                if (schedule.startTime && schedule.endTime) {
                    const startTimeComponents = schedule.startTime.split(' ');
                    const endTimeComponents = schedule.endTime.split(' ');
                    // Get the start and end times in 24-hour format
                    const startTime = startTimeComponents[1] === 'am'
                        ? parseInt(startTimeComponents[0])
                        : parseInt(startTimeComponents[0]) + 12;
                    const endTime = endTimeComponents[1] === 'am'
                        ? parseInt(endTimeComponents[0])
                        : parseInt(endTimeComponents[0]) + 12;
                    // Calculate the time difference
                    let timeDiff = endTime - startTime;
                    if (timeDiff < 0) {
                        timeDiff = timeDiff + 12;
                    }
                    // Add the time difference to the total schedule hours
                    totalScheduleHours += timeDiff;
                }
                else {
                    // Handle schedules without valid startTime or endTime
                    // console.warn('Schedule without valid startTime or endTime:', schedule);
                }
            }
            catch (error) {
                console.error('Error calculating schedule hours:', error);
                // Handle the error as needed
            }
        });
        const schedulesCount = schedules.length;
        const shiftsCount = schedules.filter(schedule => schedule.shiftType === 'shift').length;
        const timeFramesCount = schedules.filter(schedule => schedule.timeFrame !== '').length;
        return {
            orgId,
            schedulesCount,
            shiftsCount,
            timeFramesCount,
            totalScheduleHours: totalScheduleHours || 0,
        };
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Error fetching statistics');
    }
});
exports.getThisMonthStatisticsService = getThisMonthStatisticsService;
