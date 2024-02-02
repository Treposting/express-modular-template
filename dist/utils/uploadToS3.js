"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const configs_1 = __importDefault(require("../configs"));
const AWS_ACCESS_KEY = configs_1.default.aws_access_key;
const AWS_SECRET_KEY = configs_1.default.aws_secret_key;
const AWS_BUCKET_NAME = configs_1.default.aws_bucket_name;
const AWS_REGION = configs_1.default.aws_region;
const AWS_BUCKET_URL = configs_1.default.aws_bucket_url;
const AWS_BUCKET_ENDPOINT = configs_1.default.aws_bucket_endpoint;
const s3Config = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY || '',
        secretAccessKey: AWS_SECRET_KEY || '',
    },
    // endpoint: AWS_BUCKET_ENDPOINT,
});
const uploadToS3 = (0, multer_1.default)({
    limits: {
        fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
    },
    storage: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: AWS_BUCKET_NAME || '',
        key: function (req, file, cb) {
            // file type check
            if (file.mimetype !== 'image/jpeg' &&
                file.mimetype !== 'image/png' &&
                file.mimetype !== 'application/pdf' &&
                file.mimetype !== 'application/msword' &&
                file.mimetype !==
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return cb(new Error('File type is not supported'));
            }
            // file name change
            const uniqueSuffix = Date.now() + '-' + file.originalname;
            // console.log("originalname", file.originalname);
            cb(null, uniqueSuffix);
        },
        metadata: function (req, file, cb) {
            cb(null, { ContentType: file.mimetype, ContentDisposition: 'inline' });
        },
        acl: 'public-read',
    }),
});
exports.uploadToS3 = uploadToS3;
