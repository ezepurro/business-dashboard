import { api } from './api';
import type { Company, CreateCompanyPayload } from '../types/company.types';

export const companyService = {
  async findAll() {
    const { data } = await api.get<{ success: true; companies: Company[] }>('/companies');
    return data.companies;
  },

  async findById(companyId: string) {
    const { data } = await api.get<{ success: true; company: Company }>(`/companies/${companyId}`);
    return data.company;
  },

  async create(payload: CreateCompanyPayload) {
    const { data } = await api.post<{ success: true; company: Company }>('/companies', payload);
    return data.company;
  },
};
