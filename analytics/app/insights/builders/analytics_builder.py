from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.insight import Insight

from app.profiling.models.dataset_profile import DatasetProfile


class AnalyticsBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        return []