export enum ENV_NAME {
  Local = 'local',
  Production = 'production',
}

export const ENV_NAMES = Object.values(ENV_NAME);

type Keys = keyof typeof ENV_NAME;
export type EnvName = (typeof ENV_NAME)[Keys];

export const getCurrEnvName = (): EnvName => {
  let envName = process.env.XPM_ENV;

  if (!process.env.XPM_ENV) throw new Error('XPM_ENV environment variable is missing!');

  if (envName !== ENV_NAME.Local && envName !== ENV_NAME.Production) {
    throw new Error(`Invalid XPM_ENV ${envName}`);
  }

  return envName;
};

export const AWS_PROFILE = 'xpm-admin';

export const PROD_DB_CREDENTIALS_SECRET_NAME = 'xpm-rds-main-prod';

export const TEST_USER_ID = (1_000_000_000_001).toString();
