"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setS3BucketType = (type) => {
    return (req, res, next) => {
        req.bucketType = type;
        console.log('type:', type);
        next();
    };
};
exports.default = setS3BucketType;
