export const queryKeys = {
  me: ['auth', 'me'] as const,
  companies: ['companies'] as const,
  company: (companyId: string) => ['companies', companyId] as const,
  datasets: (companyId: string) => ['companies', companyId, 'datasets'] as const,
  analysis: (datasetId: string) => ['datasets', datasetId, 'analysis'] as const,
};
