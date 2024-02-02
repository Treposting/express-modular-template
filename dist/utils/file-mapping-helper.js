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
exports.filesMappingHelper = void 0;
const lodash_1 = __importDefault(require("lodash"));
//Take the location from uploaded files and assign them dynamically to request body
const filesMappingHelper = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const unlinkArray = [];
    const s3BucketUrl = req.body.s3BucketUrl ? req.body.s3BucketUrl : null;
    const files = req.files;
    yield Promise.all(lodash_1.default.map(files, function (value, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentKey = key;
            let images = [];
            yield Promise.all(lodash_1.default.map(value, (value, key) => __awaiter(this, void 0, void 0, function* () {
                images = [...images, value.key];
                unlinkArray.push({ Key: s3BucketUrl + '/' + value.key });
            })));
            req.body[`${currentKey}`] = images;
        });
    }));
    if (lodash_1.default.size(unlinkArray) && s3BucketUrl)
        req.body.unlinkArray = unlinkArray;
    return req;
});
exports.filesMappingHelper = filesMappingHelper;
