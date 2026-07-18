import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { datasetService } from '../services/datasetService';
import { queryKeys } from '../constants/queryKeys';

export function useDatasets(companyId: string) {
  return useQuery({
    queryKey: queryKeys.datasets(companyId),
    queryFn: () => datasetService.findAll(companyId),
    enabled: Boolean(companyId),
  });
}

export function useUploadDataset(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => datasetService.upload(companyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.datasets(companyId) });
    },
  });
}
