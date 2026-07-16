import { Client } from 'minio';
import { env } from './env';

export const minioClient = new Client({
  endPoint: env.MINIO.ENDPOINT,
  port: env.MINIO.PORT,
  useSSL: env.MINIO.USE_SSL,
  accessKey: env.MINIO.ACCESS_KEY,
  secretKey: env.MINIO.SECRET_KEY,
});
