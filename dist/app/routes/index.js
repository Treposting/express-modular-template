"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Common_routes_1 = require("../modules/Common/Common.routes");
const Organization_routes_1 = require("../modules/Organization/Organization.routes");
const Role_routes_1 = require("../modules/Role/Role.routes");
const schedules_routes_1 = require("../modules/Schedules/schedules.routes");
const Statistics_routes_1 = require("../modules/Statistics/Statistics.routes");
const users_routes_1 = require("../modules/Users/users.routes");
const state_routes_1 = require("./../modules/States/state.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/roles',
        route: Role_routes_1.RoleRoutes,
    },
    {
        path: '/organization',
        route: Organization_routes_1.OrganizationRoutes,
    },
    {
        path: '/user',
        route: users_routes_1.userRoutes,
    },
    { path: '/states', route: state_routes_1.statesRoutes },
    { path: '/schedule', route: schedules_routes_1.scheduleRoutes },
    { path: '/statistics', route: Statistics_routes_1.StaticticsRoutes },
    { path: '/common', route: Common_routes_1.CommonRoutes },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
