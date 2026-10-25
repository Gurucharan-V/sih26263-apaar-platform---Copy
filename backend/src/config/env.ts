import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://apaar_user:apaar_secret@localhost:5432/apaar',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_sih26263_apaar',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || 'minioadmin',
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || 'minioadmin',
  S3_BUCKET: process.env.S3_BUCKET || 'uploads',
  ANALYTICS_URL: process.env.ANALYTICS_URL || 'http://localhost:8000',
};
