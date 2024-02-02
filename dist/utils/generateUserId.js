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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const Organization_model_1 = __importDefault(require("../app/modules/Organization/Organization.model"));
const users_model_1 = require("../app/modules/Users/users.model");
const generateId = (organizationName) => __awaiter(void 0, void 0, void 0, function* () {
    // Trim the organization name
    organizationName = organizationName.trim();
    const organization = yield Organization_model_1.default.findOne({
        name: organizationName,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    const users = yield users_model_1.User.find({ organization: organization._id });
    // Cast to any first, then cast to IUser
    const lastUser = users[users.length - 1];
    let userId = '';
    if (!lastUser) {
        userId = `${organizationName}-0001`;
    }
    else {
        const lastUserId = lastUser.userId;
        const lastUserIdNumber = parseInt(lastUserId.split('-')[1]);
        const nextUserIdNumber = lastUserIdNumber + 1;
        userId = `${organizationName}-${nextUserIdNumber
            .toString()
            .padStart(4, '0')}`;
    }
    return userId;
});
exports.generateId = generateId;
