"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const Role_constant_1 = require("../Role/Role.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        firstName: {
            type: String,
            trim: true,
            required: [true, 'First Name is required'],
        },
        middleName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: [true, 'Last Name is required'],
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
        unique: true,
        lowercase: true,
    },
    dob: {
        type: Date,
        trim: true,
        required: [true, 'Date of birth is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    plainPassword: {
        type: String,
    },
    role: {
        type: String,
        enum: Role_constant_1.roles,
        default: 'client',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (value) {
                return validator_1.default.isMobilePhone(value, 'en-US');
            },
            message: 'Please provide a valid US number',
        },
        required: [true, 'Phone Number is required'],
    },
    emergencyInformation: {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        relationship: {
            type: String,
            required: [true, 'Relationship is required'],
        },
        emergencyContact: {
            type: String,
            validate: {
                validator: function (value) {
                    return validator_1.default.isMobilePhone(value, 'en-US');
                },
                message: 'Please provide a valid US number',
            },
            required: [true, 'Emergency Contact is required'],
        },
    },
    payerInformation: {
        phoneNumber: {
            type: String,
        },
        insuranceCompany: {
            type: String,
        },
        policyNumber: {
            type: String,
        },
        selfPay: {
            type: Boolean,
            default: false,
        },
        insurance: {
            type: Boolean,
            default: false,
        },
    },
    address: {
        county: {
            type: String,
            trim: true,
            required: [true, 'County is required'],
        },
        address1: {
            type: String,
            trim: true,
            required: [true, 'Address Line 1 is required'],
        },
        address2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            trim: true,
            required: [true, 'State is required'],
        },
        zip: {
            type: String,
            trim: true,
            required: [true, 'Zip code is required'],
        },
    },
    socialSecurityNumber: {
        type: String,
        trim: true,
        required: [true, 'Social Security Number is required'],
    },
    image: {
        type: String,
        required: true,
        validate: [validator_1.default.isURL, 'Please enter a valid URL'],
        default: 'https://via.placeholder.com/150',
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    passwordResetOTP: Number,
    passwordResetTimestamp: Date,
    passwordResetExpires: Date,
    confirmationToken: String,
    confirmationTokenExpires: Date,
    passwordChangedAt: Date,
    disablesStatus: {
        type: Boolean,
        default: false,
    },
    disableReason: {
        type: String,
        trim: true,
    },
    disableTimestamp: Date,
    unblockTimestamp: Date,
    disabledBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    unblockedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    detailsUpdatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    userId: {
        type: String,
        trim: true,
    },
    referralInfo: {
        refferBy: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
        },
    },
    transactions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    documents: [
        {
            _id: {
                type: String,
                required: true,
            },
            fileName: {
                type: String,
                required: true,
            },
            fileUrl: {
                type: String,
                validate: [validator_1.default.isURL, 'Please enter a valid URL'],
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    menuPermissions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Menu',
        },
    ],
}, { timestamps: true });
// Pre-save hook to modify the role
userSchema.pre('save', function (next) {
    // If the role is 'admin' or 'superAdmin', change it to 'user'
    if (this.role === 'superAdmin' || this.role === 'developer') {
        this.role = 'user';
    }
    // No need to change for 'client' or 'caregiver'
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
