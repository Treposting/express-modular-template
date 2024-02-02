"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const mongoose_1 = require("mongoose");
const excludeDatesSchema = new mongoose_1.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isDetele: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const caregiverAssignmentSchema = new mongoose_1.Schema({
    caregiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    }
});
const scheduleSchema = new mongoose_1.Schema({
    scheduleType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        // required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: false,
    },
    shiftType: {
        type: String,
        enum: ['shift', 'visit'],
        required: true,
    },
    monday: {
        type: Boolean,
        default: false,
    },
    tuesday: {
        type: Boolean,
        default: false,
    },
    wednesday: {
        type: Boolean,
        default: false,
    },
    thursday: {
        type: Boolean,
        default: false,
    },
    friday: {
        type: Boolean,
        default: false,
    },
    saturday: {
        type: Boolean,
        default: false,
    },
    sunday: {
        type: Boolean,
        default: false,
    },
    // caregiver: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: false,
    //   default: null,
    // },
    startTime: {
        type: String,
        required: false,
    },
    endTime: {
        type: String,
        required: false,
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeFrame: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'overnight', ''],
        default: '',
        validate: {
            validator: function (v) {
                // Change this to an arrow function
                return (this.shiftType !== 'visit' ||
                    (this.shiftType === 'visit' && !!v));
            },
            message: 'TimeFrame is required when shiftType is "visit"',
        },
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    excludedWeeks: [excludeDatesSchema],
    caregiverAssignments: [caregiverAssignmentSchema],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.Schedule = (0, mongoose_1.model)('Schedule', scheduleSchema);
