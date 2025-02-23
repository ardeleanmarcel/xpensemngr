import { Knex } from 'knex';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { AWS_PROFILE, ENV_NAME, EnvName, PROD_DB_CREDENTIALS_SECRET_NAME } from './constants.ts';
import { dbCredentialsSchema } from './utils.ts';

const secretsManagerClient = new SecretsManagerClient({
  profile: AWS_PROFILE,
});

const fetchProductionDbCredentials = async () => {
  try {
    const command = new GetSecretValueCommand({ SecretId: PROD_DB_CREDENTIALS_SECRET_NAME });

    const { SecretString } = await secretsManagerClient.send(command);
    if (!SecretString) return;

    const secret = JSON.parse(SecretString);
    const credentials = dbCredentialsSchema.parse(secret);

    return credentials;
  } catch (e) {
    console.error(e);
    throw new Error('Error when fetching DB credentials');
  }
};

const stubFile = 'migration.stub';

export const postgresConfig: { [key in EnvName]: Knex.Config } = {
  [ENV_NAME.local]: {
    client: 'pg',
    connection: {
      host: process.env.LOCAL_DB_HOST,
      port: parseInt(process.env.LOCAL_DB_PORT ?? '3000'),
      database: process.env.LOCAL_DB_NAME,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASS,
    },
    migrations: {
      stub: stubFile,
      schemaName: ENV_NAME.local,
      extension: 'ts',
    },
  },
  [ENV_NAME.production]: {
    client: 'pg',
    connection: async () => {
      const credentials = await fetchProductionDbCredentials();
      if (!credentials) throw new Error('Failed to fetch production DB credentials');

      return {
        host: credentials.host,
        port: credentials.port,
        database: credentials.dbname,
        user: credentials.username,
        password: credentials.password,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    },
    migrations: {
      stub: stubFile,
      schemaName: ENV_NAME.production,
      extension: 'ts',
    },
  },
};
