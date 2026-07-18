/**
 * Mirrors the `Analysis` document (docs/database_model.md §2.4) and the
 * FastAPI callback contract (docs/srs.md §5.2). The Analytics Service does
 * not exist yet, so `services/analysisService.ts` fabricates data shaped
 * exactly like this until the real pipeline is built.
 */
export interface AnalysisKpis {
  totalRevenue: number;
  averageTicket: number;
  topSellingProduct: string;
  totalOrders: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
}

export interface Analysis {
  datasetId: string;
  status: 'success' | 'error';
  kpis: AnalysisKpis;
  monthlyTrends: MonthlyTrend[];
  isMock: true;
}
