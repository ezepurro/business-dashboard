import { StorageFactory } from './storage.factory';

export async function initializeStorage(): Promise<void> {
  const storage = StorageFactory.create();

  if (storage.initialize) {
    await storage.initialize();
  }
}
