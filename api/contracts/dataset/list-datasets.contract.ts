export interface ListDatasetsContract {
  companyId: string;
  userId: string;

  page: number;
  limit: number;

  search?: string;

  sortBy?: 'createdAt' | 'originalFilename' | 'size';

  order?: 'asc' | 'desc';

  status?: string;
}
