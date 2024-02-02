"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    const skipLimit = options.skipLimit;
    const organization = options.organization || '';
    const role = options.role || '';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        skipLimit,
        organization,
        role,
    };
};
exports.paginationHelpers = {
    calculatePagination,
};
