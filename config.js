import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
    modelPath: path.join(process.cwd(), process.env.MODEL_PATH ),
    corsOrigin: process.env.CORS_ORIGIN || '*',
};
