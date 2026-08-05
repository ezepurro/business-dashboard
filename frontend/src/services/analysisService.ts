import { api } from './api';
import type { Analysis } from '../types/analysis.types';

interface GetAnalysisResponse {
  success: boolean;
  analysis: Analysis;
}

export const analysisService = {
  async getAnalysis(companyId: string, datasetId: string): Promise<Analysis> {
    const { data } = await api.get<GetAnalysisResponse>(
      `/companies/${companyId}/datasets/${datasetId}/analysis`,
    );

    return data.analysis;
  },
};
