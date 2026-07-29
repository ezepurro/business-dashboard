import pandas as pd
from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import distribution_items, top_bottom_items, numeric_series
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.distribution_item import DistributionItem
from app.analytics.models.entity_summary import EntitySummary
from app.analytics.models.chart_data import ChartData
from app.analytics.models.chart_point import ChartPoint
from app.analytics.models.chart_series import ChartSeries
from app.profiling.models.dataset_metadata import DatasetMetadata


class ProductAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []
        charts = []

        product_columns = self.columns_with_semantic_types(metadata, {"product"})
        if not product_columns:
            return AnalysisResult()

        sales_column = self.first_column_with_semantic_types(metadata, {"sales", "amount", "money", "currency"})
        quantity_column = self.first_column_with_semantic_types(metadata, {"quantity"})

        for product_column in product_columns:
            if product_column not in df.columns:
                continue

            grouped = df.groupby(product_column, dropna=True)
            counts = grouped.size().sort_values(ascending=False)
            unique_count = int(df[product_column].nunique(dropna=True))

            top_items, bottom_items = top_bottom_items(df[product_column], top_n=5)

            total_value = None
            average_value = None

            if sales_column and sales_column in df.columns:
                revenue_by_product = grouped[sales_column].sum().sort_values(ascending=False)
                total_value = float(pd.to_numeric(df[sales_column], errors="coerce").dropna().sum())
                average_value = float(pd.to_numeric(df[sales_column], errors="coerce").dropna().mean())
                ranking_source = revenue_by_product
            elif quantity_column and quantity_column in df.columns:
                quantity_by_product = grouped[quantity_column].sum().sort_values(ascending=False)
                total_value = float(pd.to_numeric(df[quantity_column], errors="coerce").dropna().sum())
                average_value = float(pd.to_numeric(df[quantity_column], errors="coerce").dropna().mean())
                ranking_source = quantity_by_product
            else:
                ranking_source = counts

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
                column=product_column,
                entity_type="product",
                unique_count=unique_count,
                total_records=int(len(df)),
                total_value=total_value,
                average_value=average_value,
                frequency=float(len(df) / unique_count) if unique_count else None,
                top_items=top_items,
                bottom_items=bottom_items,
                ranking=ranking,
            )

            metrics.append(
                BusinessMetric(
                    name="product_summary",
                    value=summary,
                    column=product_column,
                    semantic_type="product",
                    confidence=1.0,
                    aggregation="ranking_summary",
                )
            )

            charts.append(
                ChartData(
                    chart_type="bar",
                    title=f"Top products by {sales_column or quantity_column or 'frequency'}",
                    labels=[item.label for item in ranking[:10]],
                    series=[
                        ChartSeries(
                            name=sales_column or quantity_column or "count",
                            points=[ChartPoint(label=item.label, value=item.count, share=item.share) for item in ranking[:10]],
                        )
                    ],
                )
            )

        return AnalysisResult(metrics=metrics, charts=charts)