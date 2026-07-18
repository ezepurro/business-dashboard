export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiValidationErrorResponse {
  success: false;
  errors: ApiFieldError[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
