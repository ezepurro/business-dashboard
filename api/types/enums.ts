export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum DatasetStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export enum AnalysisStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
