"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const mongoose_1 = require("mongoose");
const Role_constant_1 = require("./Role.constant");
const rolesSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: Role_constant_1.roles,
        required: true,
    },
}, { timestamps: true });
const RoleModel = (0, mongoose_1.model)('Role', rolesSchema);
exports.RoleModel = RoleModel;
