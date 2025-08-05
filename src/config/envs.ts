import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_CLIENT_SECRET: string;
  KEYCLOAK_ADMIN_USERNAME: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  PORT: number;
  HOST_API: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  host: envVars.HOST_API,
  port: envVars.PORT,
  url: `http://${envVars.HOST_API}:${envVars.PORT}`,
  db: {
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
  },
  keycloak: {
    url: envVars.KEYCLOAK_URL,
    realm: envVars.KEYCLOAK_REALM,
    issuer: `${envVars.KEYCLOAK_URL}/realms/${envVars.KEYCLOAK_REALM}`,
    clientId: envVars.KEYCLOAK_CLIENT_ID,
    clientSecret: envVars.KEYCLOAK_CLIENT_SECRET,
    username: envVars.KEYCLOAK_ADMIN_USERNAME,
    password: envVars.KEYCLOAK_ADMIN_PASSWORD,
    endpoint: {
      token: `${envVars.KEYCLOAK_URL}/realms/${envVars.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      certs: `${envVars.KEYCLOAK_URL}/realms/${envVars.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
    }
  },
  jwtSecret: envVars.JWT_SECRET,
};
