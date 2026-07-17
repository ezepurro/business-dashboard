import { UploadOptions } from './types/upload-options.type';
import { StorageFile } from './types/storage-file.type';

export interface StorageProvider {
  initialize?(): Promise<void>;

  getBucketName(): string;

  upload(options: UploadOptions): Promise<void>;

  download(objectKey: string): Promise<StorageFile>;

  delete(objectKey: string): Promise<void>;

  exists(objectKey: string): Promise<boolean>;
}
