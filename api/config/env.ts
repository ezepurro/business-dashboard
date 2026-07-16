function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  NODE_ENV: process.env.NODE_ENV ?? 'development',

  MONGO_URI: required('MONGO_URI'),

  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),

  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),

  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES ?? '15m',

  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? '7d',

  STORAGE_PROVIDER: required('STORAGE_PROVIDER'),

  MINIO: {
    ENDPOINT: required('MINIO_ENDPOINT'),

    PORT: Number(required('MINIO_PORT')),

    USE_SSL: required('MINIO_USE_SSL') === 'true',

    ACCESS_KEY: required('MINIO_ACCESS_KEY'),

    SECRET_KEY: required('MINIO_SECRET_KEY'),

    BUCKET: required('MINIO_BUCKET'),
  },

  ANALYTICS: {
    URL: required('ANALYTICS_SERVICE_URL'),
  },
};
