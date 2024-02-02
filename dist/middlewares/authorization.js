"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const authorization = (roles) => {
    return (req, res, next) => {
        var _a, _b;
        const role = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!roles.includes(role)) {
            return res.status(401).send({
                message: 'Unauthorized',
                status: 401,
            });
        }
        // log.info(`role: ${role}`)
        next();
    };
};
exports.authorization = authorization;
