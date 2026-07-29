import pandas as pd
from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import top_bottom_items
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.distribution_item import DistributionItem
from app.analytics.models.entity_summary import EntitySummary
from app.analytics.models.finding import Finding
from app.profiling.models.dataset_metadata import DatasetMetadata


class CustomerAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []
        findings = []

        customer_columns = self.columns_with_semantic_types(metadata, {"customer"})
        if not customer_columns:
            return AnalysisResult()

        sales_column = self.first_column_with_semantic_types(metadata, {"sales", "amount", "money", "currency"})
        quantity_column = self.first_column_with_semantic_types(metadata, {"quantity"})

        for customer_column in customer_columns:
            if customer_column not in df.columns:
                continue

            grouped = df.groupby(customer_column, dropna=True)
            counts = grouped.size().sort_values(ascending=False)
            unique_count = int(df[customer_column].nunique(dropna=True))

            top_items, bottom_items = top_bottom_items(df[customer_column], top_n=5)

            total_value = None
            average_value = None

            if sales_column and sales_column in df.columns:
                value_series = pd.to_numeric(df[sales_column], errors="coerce").dropna()
                per_customer = grouped[sales_column].sum().sort_values(ascending=False)
                total_value = float(value_series.sum())
                average_value = float(value_series.mean())
                ranking_source = per_customer
            elif quantity_column and quantity_column in df.columns:
                value_series = pd.to_numeric(df[quantity_column], errors="coerce").dropna()
                per_customer = grouped[quantity_column].sum().sort_values(ascending=False)
                total_value = float(value_series.sum())
                average_value = float(value_series.mean())
                ranking_source = per_customer
            else:
                ranking_source = counts

            recurrence_rate = None
            if unique_count:
                repeated_customers = int((counts > 1).sum())
                recurrence_rate = repeated_customers / unique_count

            ranking = [
                DistributionItem(
                    label=str(label),
                    count=float(count),
                    share=float(count) / float(ranking_source.sum()) if ranking_source.sum() else 0.0,
                    rank=index,
                )
                for index, (label, count) in enumerate(ranking_source.head(10).items(), start=1)
            ]

            summary = EntitySummary(
                column=customer_column,
                entity_type="customer",
                unique_count=unique_count,
                total_records=int(len(df)),
                total_value=total_value,
                average_value=average_value,
                frequency=float(len(df) / unique_count) if unique_count else None,
                recurrence_rate=recurrence_rate,
                top_items=top_items,
                bottom_items=bottom_items,
                ranking=ranking,
            )

            metrics.append(
                BusinessMetric(
                    name="customer_summary",
                    value=summary,
                    column=customer_column,
                    semantic_type="customer",
                    confidence=1.0,
                    aggregation="ranking_summary",
                )
            )

            if unique_count and recurrence_rate is not None:
                findings.append(
                    Finding(
                        title="customer recurrence",
                        description=f"{recurrence_rate:.2%} of customers repeated at least once.",
                        confidence=1.0,
                        related_columns=[customer_column],
                    )
                )

        return AnalysisResult(metrics=metrics, findings=findings)