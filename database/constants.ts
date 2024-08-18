export const ENV_NAME = {
  development: 'development',
  production: 'production',
} as const;

export const ENV_NAMES = Object.values(ENV_NAME);

type Keys = keyof typeof ENV_NAME;
export type EnvName = (typeof ENV_NAME)[Keys];

export const getCurrEnvName = (): EnvName => {
  let nodeEnv = process.env.NODE_ENV;

  if (!process.env.NODE_ENV) throw new Error('NODE_ENV environment variable is missing!');

  if (nodeEnv !== ENV_NAME.development && nodeEnv !== ENV_NAME.production) {
    throw new Error(`Invalid NODE_ENV ${nodeEnv}`);
  }

  return nodeEnv;
};
