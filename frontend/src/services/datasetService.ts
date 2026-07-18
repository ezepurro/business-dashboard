import { api } from './api';
import type { Dataset, PaginatedDatasets } from '../types/dataset.types';

export const datasetService = {
  async findAll(companyId: string) {
    const { data } = await api.get<PaginatedDatasets>(`/companies/${companyId}/datasets`, {
      params: { limit: 50, sortBy: 'createdAt', order: 'desc' },
    });
    return data;
  },

  async upload(companyId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<Dataset>(`/companies/${companyId}/datasets`, formData);
    return data;
  },
};
