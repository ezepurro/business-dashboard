import { AnalysisDocument } from '../../models/Analysis';
import { AnalysisStatus } from '../../types/enums';

export interface AnalysisResponseDto {
  id: string;
  datasetId: string;
  companyId: string;
  status: AnalysisStatus;
  profile: Record<string, unknown> | null;
  processingTime: number | null;
  pythonVersion: string | null;
  engineVersion: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toAnalysisResponseDto(analysis: AnalysisDocument): AnalysisResponseDto {
  return {
    id: analysis._id.toString(),
    datasetId: analysis.datasetId.toString(),
    companyId: analysis.companyId.toString(),
    status: analysis.status,
    profile: (analysis.profile as Record<string, unknown> | null) ?? null,
    processingTime: analysis.processingTime ?? null,
    pythonVersion: analysis.pythonVersion ?? null,
    engineVersion: analysis.engineVersion ?? null,
    errorMessage: analysis.errorMessage ?? null,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
}
