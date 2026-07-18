import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import { queryKeys } from '../constants/queryKeys';
import type { CreateCompanyPayload } from '../types/company.types';

export function useCompanies() {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: companyService.findAll,
  });
}

export function useCompany(companyId: string) {
  return useQuery({
    queryKey: queryKeys.company(companyId),
    queryFn: () => companyService.findById(companyId),
    enabled: Boolean(companyId),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies });
    },
  });
}
