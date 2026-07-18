import { isAxiosError } from 'axios';
import type { ApiFieldError } from '../types/api.types';

interface ParsedApiError {
  message: string;
  fieldErrors: ApiFieldError[];
}

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export function parseApiError(error: unknown): ParsedApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: ApiFieldError[] } | undefined;

    if (data?.errors?.length) {
      return { message: data.errors[0].message, fieldErrors: data.errors };
    }

    if (data?.message) {
      return { message: data.message, fieldErrors: [] };
    }
  }

  return { message: FALLBACK_MESSAGE, fieldErrors: [] };
}
