"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.MONGO_URI,
    env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiresIn: process.env.JWT_EXPIRES_IN,
    sendin_blue_api_key: process.env.SENDINBLUE_API_KEY,
    email_sender: process.env.EMAIL_SENDER,
    email_reply_to: process.env.EMAIL_REPLY_TO,
    company_name: process.env.COMPANY_NAME,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_api_key: process.env.GOOGLE_API_KEY,
    secret_key: process.env.SECRET_KEY,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    stripe_secrect_key: process.env.STRIPE_SECRECT_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
    aws_bucket_url: process.env.AWS_BUCKET_URL,
    aws_bucket_endpoint: process.env.AWS_BUCKET_ENDPOINT,
    aws_file_size_limit: process.env.AWS_FILE_SIZE_LIMIT,
};
