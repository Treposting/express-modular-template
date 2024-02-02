"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
// Create the Mongoose schema for the Organization
const organizationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        validate: {
            validator: function (value) {
                return validator_1.default.isMobilePhone(value, 'en-US');
            },
            message: 'Please provide a valid US number',
        },
        required: [true, 'Phone Number is required'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    organizationStatus: {
        type: Boolean,
        default: true,
    },
    users: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    usersCount: {
        type: Number,
        default: 0,
    },
    disabledBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    disabledAt: {
        type: Date,
    },
    disabledReason: {
        type: String,
    },
    unblockedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    unblockedAt: {
        type: Date,
    },
    unblockTimestamp: {
        type: Date,
    },
    disableTimestamp: {
        type: Date,
    },
    disableReason: {
        type: String,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
// Create the Mongoose model for the Organization
const OrganizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = OrganizationModel;
