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
exports.imageOrFileUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const lodash_1 = __importDefault(require("lodash"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const configs_1 = __importDefault(require("../configs"));
const s3 = new aws_sdk_1.default.S3({
    secretAccessKey: configs_1.default.aws_secret_key,
    accessKeyId: configs_1.default.aws_access_key,
});
//define allowed file types
const allowedFileTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
];
//define allowed image types
const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
];
const fileFieldNames = ['files', 'file'];
const imageFieldNames = ['images', 'image'];
//validate image mime types or file types
//with validate image/file extension
const checkValidType = (req, file, cb) => {
    // if ((_.indexOf(imageFieldNames, file.fieldname) !== -1 && _.indexOf(allowedImageTypes, file.mimetype) !== -1) ||
    //     (_.indexOf(fileFieldNames, file.fieldname) !== -1 && _.indexOf(allowedFileTypes, file.mimetype) !== -1))
    if (lodash_1.default.indexOf(allowedImageTypes, file.mimetype) !== -1 ||
        lodash_1.default.indexOf(allowedFileTypes, file.mimetype) !== -1) {
        cb(null, true);
    }
    else {
        const errorMessage = 'Invalid file type, only pdf, doc, JPEG, JPG, PNG and GIF are allowed!';
        cb(new Error(errorMessage), false);
    }
};
const getS3BucketName = (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketName = configs_1.default.aws_bucket_name;
    cb(null, bucketName);
});
const fileSizeLimit = parseInt(configs_1.default.aws_file_size_limit || '5000000', 10);
exports.imageOrFileUpload = (0, multer_1.default)({
    limits: { fileSize: fileSizeLimit },
    fileFilter: checkValidType,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            yield getS3BucketName(req, file, cb);
        }),
        acl: 'public-read',
        contentType: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, file.mimetype);
        }),
        metadata: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, { fieldName: file.fieldname });
        }),
        key: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            const uniqueSuffix = Date.now() + '-' + file.originalname;
            cb(null, uniqueSuffix);
        }),
    }),
});
