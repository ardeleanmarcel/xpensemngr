import 'dotenv/config';
import { z } from 'zod';

import { XPM_ENV } from '@src/constants/env.const';

const envConfigSchema = z
  .object({
    XPM_ENV: z.enum([XPM_ENV.development, XPM_ENV.production]),
    DB_HOST: z.string(),
    DB_PORT: z.number().gte(1).lte(65535),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    AUTH_JWT_SECRET: z.string(),
    MYE_WEB_UI_ROOT_URL: z.string().url(),
    SENDGRID_API_KEY: z.string(),
    NOTIFICATION_EMAIL_SOURCE: z.string().email(),
  })
  .strict();

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASS', 'XPM_ENV', 'AUTH_JWT_SECRET'];

const checkEnvVars = () => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
};

checkEnvVars();

const ENV_VARS = envConfigSchema.parse({
  XPM_ENV: process.env.XPM_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT ?? ''),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
  MYE_WEB_UI_ROOT_URL: process.env.MYE_WEB_UI_ROOT_URL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  NOTIFICATION_EMAIL_SOURCE: process.env.NOTIFICATION_EMAIL_SOURCE,
});

console.log('ENV_VARS', ENV_VARS);

export { ENV_VARS };
