export type DatasetStatus = 'UPLOADING' | 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED' | 'DELETED';

export interface Dataset {
  _id: string;
  company: string;
  uploadedBy: string;
  originalFilename: string;
  extension: string;
  mimeType: string;
  size: number;
  bucket: string;
  objectKey: string;
  status: DatasetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDatasets {
  data: Dataset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
