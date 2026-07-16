export interface StorageFile {
  stream: NodeJS.ReadableStream;
  size: number;
  mimeType: string;
}
