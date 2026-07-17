export interface UploadDatasetContract {
  companyId: string;
  uploadedBy: string;

  originalFilename: string;
  extension: string;

  mimeType: string;
  size: number;

  buffer: Buffer;
}
