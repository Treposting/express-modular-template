"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const SibApiV3Sdk = __importStar(require("@sendinblue/client"));
const ejs_1 = __importDefault(require("ejs")); // Import the EJS library
const configs_1 = __importDefault(require("../configs"));
const logger_1 = require("./logger");
// Initialize the Sendinblue client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, configs_1.default.sendin_blue_api_key);
// Define the middleware function
function sendEmail(data) {
    const { to, subject, template, templateData } = data;
    // Render the EJS template to HTML
    ejs_1.default.renderFile(template, templateData, (err, html) => {
        if (err) {
            console.error('Error rendering EJS template:', err);
            return;
        }
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
            name: configs_1.default.company_name,
            email: configs_1.default.email_sender,
        };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html; // Use the rendered HTML
        sendSmtpEmail.replyTo = { email: configs_1.default.email_reply_to };
        sendSmtpEmail.headers = { 'Content-Type': 'text/html' };
        // Send the email
        apiInstance
            .sendTransacEmail(sendSmtpEmail)
            .then(function () {
            logger_1.log.info('Email sent successfully.');
        })
            .catch(function (error) {
            console.error(error);
        });
    });
}
exports.sendEmail = sendEmail;
