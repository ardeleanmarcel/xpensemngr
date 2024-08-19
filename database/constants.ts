export const ENV_NAME = {
  development: 'development',
  production: 'production',
} as const;

export const ENV_NAMES = Object.values(ENV_NAME);

type Keys = keyof typeof ENV_NAME;
export type EnvName = (typeof ENV_NAME)[Keys];

export const getCurrEnvName = (): EnvName => {
  let envName = process.env.XPM_ENV;

  if (!process.env.XPM_ENV) throw new Error('XPM_ENV environment variable is missing!');

  if (envName !== ENV_NAME.development && envName !== ENV_NAME.production) {
    throw new Error(`Invalid XPM_ENV ${envName}`);
  }

  return envName;
};
