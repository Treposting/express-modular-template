"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRanges = exports.findOverlappingInterval = exports.isRangeCovered = void 0;
// Helper function to check if an existing range is completely covered by a new range
const isRangeCovered = (existingRange, newRange) => {
    const existingStart = new Date(existingRange.startDate).getTime();
    const existingEnd = new Date(existingRange.endDate).getTime();
    const newStart = new Date(newRange.startDate).getTime();
    const newEnd = new Date(newRange.endDate).getTime();
    return newStart <= existingStart && newEnd >= existingEnd;
};
exports.isRangeCovered = isRangeCovered;
// Helper function to find overlapping interval index
const findOverlappingInterval = (existingExcludedWeeks, newExcludedWeeks) => {
    for (let i = 0; i < existingExcludedWeeks.length; i++) {
        const existingWeek = existingExcludedWeeks[i];
        const newWeek = newExcludedWeeks[0];
        const newStart = new Date(newWeek.startDate).getTime();
        const newEnd = new Date(newWeek.endDate).getTime();
        const existingStart = new Date(existingWeek.startDate).getTime();
        const existingEnd = new Date(existingWeek.endDate).getTime();
        if (!(newEnd < existingStart || newStart > existingEnd)) {
            // Overlapping intervals, return the index
            return i;
        }
    }
    // No overlapping interval found
    return -1;
};
exports.findOverlappingInterval = findOverlappingInterval;
// Helper function to merge overlapping ranges
const mergeRanges = (range1, range2) => {
    const mergedRange = {
        startDate: new Date(Math.min(new Date(range1.startDate).getTime(), new Date(range2.startDate).getTime())),
        endDate: new Date(Math.max(new Date(range1.endDate).getTime(), new Date(range2.endDate).getTime())),
    };
    return mergedRange;
};
exports.mergeRanges = mergeRanges;
