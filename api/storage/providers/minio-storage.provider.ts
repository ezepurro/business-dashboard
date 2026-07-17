import { Client } from 'minio';
import { env } from '../../config/env';
import { minioClient } from '../../config/minio';
import { StorageProvider } from '../storage.provider';
import { UploadOptions } from '../types/upload-options.type';
import { StorageFile } from '../types/storage-file.type';
import { StorageError } from '../errors/storage.error';

export class MinIOStorageProvider implements StorageProvider {
  private readonly client: Client;
  private readonly bucket: string;

  constructor() {
    this.client = minioClient;
    this.bucket = env.MINIO.BUCKET;
  }

  getBucketName(): string {
    return this.bucket;
  }

  async initialize(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);

      if (!exists) {
        await this.client.makeBucket(this.bucket);

        console.info(`[Storage] Bucket "${this.bucket}" created.`);
      }
    } catch {
      throw new StorageError('Failed to initialize storage.');
    }
  }

  async upload(options: UploadOptions): Promise<void> {
    try {
      await this.client.putObject(
        this.bucket,
        options.objectKey,
        options.buffer,
        options.buffer.length,
        {
          'Content-Type': options.mimeType,
        },
      );
    } catch {
      throw new StorageError('Failed to upload file.');
    }
  }

  async download(objectKey: string): Promise<StorageFile> {
    try {
      const stat = await this.client.statObject(this.bucket, objectKey);

      const stream = await this.client.getObject(this.bucket, objectKey);

      return {
        stream,
        size: stat.size,
        mimeType: stat.metaData['content-type'] ?? 'application/octet-stream',
      };
    } catch {
      throw new StorageError('Failed to download file.');
    }
  }

  async delete(objectKey: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucket, objectKey);
    } catch {
      throw new StorageError('Failed to delete file.');
    }
  }

  async exists(objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, objectKey);

      return true;
    } catch {
      return false;
    }
  }
}
