"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchableFields = exports.userFilterableFields = void 0;
exports.userFilterableFields = ['searchTerm'];
exports.userSearchableFields = [
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'email',
    'phoneNumber',
    'socialSecurityNumber',
    'organization.name',
    'address.city',
    'address.state',
    'address.zip',
    'address.address1',
    'address.address2',
    'address.county',
    'role',
    'status',
];
