import path from 'node:path';

export function buildDatasetObjectKey(
  companyId: string,
  datasetId: string,
  extension: string,
): string {
  const normalizedExtension = extension.startsWith('.') ? extension.slice(1) : extension;

  return path.posix.join('companies', companyId, `${datasetId}.${normalizedExtension}`);
}
