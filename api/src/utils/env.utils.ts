import 'dotenv/config';
import { z } from 'zod';
import { log } from '@xpm/logging';

import { XPM_ENV } from '@src/constants/env.const.ts';

const envConfigSchema = z
  .object({
    XPM_ENV: z.enum([XPM_ENV.Local, XPM_ENV.Production]),
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

const ENV_VARS = getEnvVars();

function getEnvVars() {
  try {
    const vars = envConfigSchema.parse({
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

    return vars;
  } catch (e) {
    // TODO (Valle) -> import the logger from the database folder and use it
    log('MISSING OR INCORRECT ENVIRONMENT VARIABLE(S)');
    throw e;
  }
}

export { ENV_VARS };
