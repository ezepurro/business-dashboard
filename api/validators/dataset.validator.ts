import path from 'node:path';
import ApiError from '../utils/ApiError';
import { query } from 'express-validator';

const ALLOWED_EXTENSIONS = ['csv', 'xlsx', 'xls'];

export function validateDatasetFile(file: Express.Multer.File): string {
  const extension = path.extname(file.originalname).slice(1).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new ApiError(400, 'Unsupported dataset format.');
  }

  return extension;
}

export const listDatasetsValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['createdAt', 'originalFilename', 'size']),
  query('order').optional().isIn(['asc', 'desc']),
];
