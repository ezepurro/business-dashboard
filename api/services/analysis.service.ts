import { performance } from 'node:perf_hooks';
import { Company } from '../models';
import ApiError from '../utils/ApiError';
import analysisRepository, { AnalysisRepository } from '../repositories/analysis.repository';
import pythonService, { PythonService } from './python/python.service';
import { AnalysisStatus } from '../types/enums';
import { ProcessAnalysisContract } from '../contracts/analysis/process-analysis.contract';
import { toAnalysisResponseDto, AnalysisResponseDto } from '../dtos/analysis/analysis-response.dto';

export class AnalysisService {
  constructor(
    private readonly repository: AnalysisRepository = analysisRepository,
    private readonly client: PythonService = pythonService,
  ) {}

  async processDataset(contract: ProcessAnalysisContract): Promise<AnalysisResponseDto> {
    const analysis = await this.repository.create({
      datasetId: contract.datasetId,
      companyId: contract.companyId,
      status: AnalysisStatus.PROCESSING,
      profile: null,
      processingTime: null,
      pythonVersion: null,
      engineVersion: null,
      errorMessage: null,
    });

    const startedAt = performance.now();

    try {
      const result = await this.client.processDataset({
        dataset_id: contract.datasetId,
        bucket: contract.bucket,
        object_key: contract.objectKey,
      });

      const updatedAnalysis = await this.repository.updateStatus(analysis._id.toString(), {
        status: AnalysisStatus.SUCCESS,
        profile: result.profile,
        processingTime: Math.round(performance.now() - startedAt),
        pythonVersion: result.pythonVersion,
        engineVersion: result.engineVersion,
        errorMessage: null,
      });

      if (!updatedAnalysis) {
        throw new ApiError(500, 'No se pudo guardar el análisis procesado.');
      }

      return toAnalysisResponseDto(updatedAnalysis);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo procesar el dataset.';

      const failedAnalysis = await this.repository.updateStatus(analysis._id.toString(), {
        status: AnalysisStatus.FAILED,
        processingTime: Math.round(performance.now() - startedAt),
        errorMessage,
      });

      if (!failedAnalysis) {
        throw error instanceof ApiError ? error : new ApiError(502, errorMessage);
      }

      throw error instanceof ApiError ? error : new ApiError(502, errorMessage);
    }
  }

  async findById(id: string, userId: string): Promise<AnalysisResponseDto> {
    const analysis = await this.repository.findById(id);

    if (!analysis) {
      throw new ApiError(404, 'Analysis not found.');
    }

    await this.assertCompanyAccess(analysis.companyId.toString(), userId);

    return toAnalysisResponseDto(analysis);
  }

  async findByDataset(
    datasetId: string,
    userId: string,
    companyId?: string,
  ): Promise<AnalysisResponseDto> {
    const analysis = await this.repository.findByDataset(datasetId);

    if (!analysis) {
      throw new ApiError(404, 'Analysis not found.');
    }

    if (companyId && analysis.companyId.toString() !== companyId) {
      throw new ApiError(404, 'Analysis not found.');
    }

    await this.assertCompanyAccess(analysis.companyId.toString(), userId);

    return toAnalysisResponseDto(analysis);
  }

  async findByCompany(companyId: string, userId: string): Promise<AnalysisResponseDto[]> {
    await this.assertCompanyAccess(companyId, userId);

    const analyses = await this.repository.findByCompany(companyId);

    return analyses.map((analysis) => toAnalysisResponseDto(analysis));
  }

  private async assertCompanyAccess(companyId: string, userId: string) {
    const company = await Company.findById(companyId);

    if (!company) {
      throw new ApiError(404, 'Company not found.');
    }

    if (company.owner.toString() !== userId) {
      throw new ApiError(403, 'You do not have access to this company.');
    }
  }
}

export default new AnalysisService();
