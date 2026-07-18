import type { Analysis, MonthlyTrend } from '../types/analysis.types';
import type { Dataset } from '../types/dataset.types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MOCK_PRODUCTS = ['Notebook Pro 15', 'Wireless Mouse X2', 'Office Chair Ergo', 'Monitor 27" 4K', '24-Pack Notebooks'];

/** Deterministic PRNG (mulberry32) seeded from the dataset id, so a given dataset always renders the same mock numbers. */
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return () => {
    hash |= 0;
    hash = (hash + 0x6d2b79f5) | 0;
    let t = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMonthlyTrends(random: () => number): MonthlyTrend[] {
  const now = new Date();

  return Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (now.getMonth() - (5 - i) + 12) % 12;
    return {
      month: MONTHS[monthIndex],
      revenue: Math.round(20000 + random() * 80000),
    };
  });
}

/**
 * The Analytics Service (FastAPI + Pandas) does not exist yet — see CLAUDE.md
 * "Next modules". This fabricates data shaped exactly like the real
 * `Analysis` document (docs/database_model.md §2.4) so the UI and the future
 * real integration are a drop-in swap.
 */
export const analysisService = {
  async getMockAnalysis(dataset: Dataset): Promise<Analysis> {
    const random = seededRandom(dataset._id);

    // simulate network/processing latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const monthlyTrends = buildMonthlyTrends(random);
    const totalRevenue = monthlyTrends.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = Math.round(150 + random() * 850);

    return {
      datasetId: dataset._id,
      status: 'success',
      isMock: true,
      kpis: {
        totalRevenue,
        averageTicket: Math.round((totalRevenue / totalOrders) * 100) / 100,
        topSellingProduct: MOCK_PRODUCTS[Math.floor(random() * MOCK_PRODUCTS.length)],
        totalOrders,
      },
      monthlyTrends,
    };
  },
};
