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

      pythonVersion: this.extractMetadata(
        data,
        'pythonVersion',
        response.headers['x-python-version'],
      ),

      engineVersion: this.extractMetadata(
        data,
        'engineVersion',
        response.headers['x-engine-version'],
      ),
    };
  }

  private extractProfile(data: Record<string, unknown>): Record<string, unknown> {
    const profile = data.profile;

    if (profile && typeof profile === 'object' && !Array.isArray(profile)) {
      return profile as Record<string, unknown>;
    }

    return data;
  }

  private extractMetadata(
    data: Record<string, unknown>,
    property: 'pythonVersion' | 'engineVersion',
    headerValue: unknown,
  ): string | null {
    const bodyValue = toStringOrNull(data[property]);

    if (bodyValue) {
      return bodyValue;
    }

    return toStringOrNull(headerValue);
  }
}

export default new PythonService();
