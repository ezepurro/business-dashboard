import axios, { AxiosInstance } from 'axios';
import { env } from '../../config/env';
import { PythonProcessDatasetContract } from '../../contracts/analysis/python-process-dataset.contract';

export interface PythonProcessResponse {
  profile: Record<string, unknown>;
  pythonVersion: string | null;
  engineVersion: string | null;
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return null;
}

export class PythonService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.ANALYTICS.URL,
      timeout: 120000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async processDataset(contract: PythonProcessDatasetContract): Promise<PythonProcessResponse> {
    const response = await this.client.post('/api/v1/process', contract);
    const data = response.data as Record<string, unknown>;

    return {
      profile: this.extractProfile(data),
      pythonVersion: this.extractMetadata(data, response.headers['x-python-version']),
      engineVersion: this.extractMetadata(data, response.headers['x-engine-version']),
    };
  }

  private extractProfile(data: Record<string, unknown>): Record<string, unknown> {
    const nestedProfile = data.profile;

    if (nestedProfile && typeof nestedProfile === 'object' && !Array.isArray(nestedProfile)) {
      return nestedProfile as Record<string, unknown>;
    }

    return data;
  }

  private extractMetadata(data: Record<string, unknown>, headerValue: unknown): string | null {
    return (
      toStringOrNull(headerValue) ??
      toStringOrNull(data.pythonVersion) ??
      toStringOrNull(data.engineVersion)
    );
  }
}

export default new PythonService();
