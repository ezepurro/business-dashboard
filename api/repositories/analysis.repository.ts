import Analysis, { AnalysisDocument } from '../models/Analysis';
import { AnalysisStatus } from '../types/enums';

export interface CreateAnalysisInput {
  datasetId: string;
  companyId: string;
  status?: AnalysisStatus;
  profile?: Record<string, unknown> | null;
  processingTime?: number | null;
  pythonVersion?: string | null;
  engineVersion?: string | null;
  errorMessage?: string | null;
}

export interface UpdateAnalysisStatusInput {
  status: AnalysisStatus;
  profile?: Record<string, unknown> | null;
  processingTime?: number | null;
  pythonVersion?: string | null;
  engineVersion?: string | null;
  errorMessage?: string | null;
}

export class AnalysisRepository {
  create(data: CreateAnalysisInput) {
    return Analysis.create(data);
  }

  findById(id: string) {
    return Analysis.findById(id);
  }

  findByDataset(datasetId: string) {
    return Analysis.findOne({ datasetId });
  }

  findByCompany(companyId: string) {
    return Analysis.find({ companyId }).sort({ createdAt: -1 });
  }

  delete(id: string) {
    return Analysis.findByIdAndDelete(id);
  }

  updateStatus(id: string, data: UpdateAnalysisStatusInput) {
    return Analysis.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
      },
    );
  }
}

export default new AnalysisRepository();
