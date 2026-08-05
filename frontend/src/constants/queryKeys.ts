export const queryKeys = {
  companies: ['companies'] as const,

  company: (id: string) => ['companies', id] as const,

  datasets: (companyId: string) => ['companies', companyId, 'datasets'] as const,

  analysis: (datasetId: string) => ['analysis', datasetId] as const,
};
