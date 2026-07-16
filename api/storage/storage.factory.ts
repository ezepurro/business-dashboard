import { env } from '../config/env';
import { StorageProvider } from './storage.provider';
import { MinIOStorageProvider } from './providers/minio-storage.provider';

export class StorageFactory {
  private static instance: StorageProvider;

  static create(): StorageProvider {
    if (!this.instance) {
      switch (env.STORAGE_PROVIDER) {
        case 'minio':
          this.instance = new MinIOStorageProvider();
          break;

        default:
          throw new Error(`Unsupported storage provider: ${env.STORAGE_PROVIDER}`);
      }
    }

    return this.instance;
  }
}
