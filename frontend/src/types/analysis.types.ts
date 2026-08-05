export type AnalysisStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface AnalysisMetric {
  name: string;
  score: number;
  description: string;
}

export interface AnalysisQuality {
  overall_score: number;
  metrics: AnalysisMetric[];
}

export interface DataDictionaryColumn {
  name: string;
  semantic_type: string;
  confidence: number;
  dtype: string;
  nullable: boolean;
  null_percentage: number;
  unique_values: number;
  sample_values: string[];
}

export interface AnalysisMetadata {
  rows: number;
  columns: number;
  data_dictionary: DataDictionaryColumn[];
}

export interface MissingValues {
  [column: string]: number;
}

export interface CleaningAction {
  action: string;
  column: string;
  description: string;
  confidence: number;
  automatic: boolean;
  estimated_affected_rows: number;
  recommendation: string | null;
}

export interface CleaningReport {
  actions: CleaningAction[];
}

export interface TransformationAction {
  transformation: string;
  column: string;
  description: string;
  confidence: number;
  affected_rows: number;
  previous_dtype: string;
  new_dtype: string;
  recommendation: string | null;
  details: Record<string, unknown> | null;
}

export interface TransformationReport {
  actions: TransformationAction[];
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  share: number | null;
}

export interface AnalyticsSeries {
  name: string;
  points: AnalyticsPoint[];
}

export interface AnalyticsChart {
  chart_type: 'line' | 'bar' | 'pie' | 'histogram';
  title: string;
  labels: string[];
  series: AnalyticsSeries[];
}

export interface AnalyticsReport {
  charts: AnalyticsChart[];
}

export interface InsightSummary {
  title: string;
  description: string;

  dataset_score: number;
  quality_score: number;

  total_rows: number;
  total_columns: number;

  total_insights: number;
  critical_insights: number;
  high_priority_insights: number;

  top_strengths: string[];
  top_risks: string[];
  recommendations: string[];
}

export interface Insight {
  title: string;
  description: string;

  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';

  confidence: number;

  related_metrics: string[];
  related_columns: string[];

  recommendations: string[];

  business_impact: 'low' | 'medium' | 'high';

  estimated_value: number | null;

  next_action: string;
}

export interface InsightGroup {
  category: string;

  priority: 'low' | 'medium' | 'high' | 'critical';

  insight_count: number;
  critical_count: number;
  high_count: number;

  insights: Insight[];
}

export interface InsightReport {
  summary: InsightSummary;
  insights: Insight[];
  groups: InsightGroup[];
}

export interface AnalysisProfile {
  metadata: AnalysisMetadata;
  quality: AnalysisQuality;
  sample: Record<string, unknown>[];
  missing_values: MissingValues;
  cleaning: CleaningReport;
  transformation: TransformationReport;
  analytics: AnalyticsReport;
  insights: InsightReport;
}

export interface Analysis {
  _id: string;
  datasetId: string;
  companyId: string;

  status: AnalysisStatus;

  profile: AnalysisProfile;

  processingTime: number;
  pythonVersion: string;
  engineVersion: string;

  errorMessage: string | null;

  createdAt: string;
  updatedAt: string;
}
