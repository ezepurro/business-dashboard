import { useQuery } from '@tanstack/react-query';
import { analysisService } from '../services/analysisService';
import { queryKeys } from '../constants/queryKeys';
import type { Dataset } from '../types/dataset.types';

export function useAnalysis(dataset: Dataset | null) {
  return useQuery({
    queryKey: queryKeys.analysis(dataset?._id ?? ''),
    queryFn: () => analysisService.getMockAnalysis(dataset!),
    enabled: Boolean(dataset),
  });
}
