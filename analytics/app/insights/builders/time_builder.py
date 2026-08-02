from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.insight_category import InsightCategory

from app.profiling.models.dataset_profile import DatasetProfile


class TimeBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ):

        return self.build_from_result(

            self.get_result(
                profile,
                "TimeAnalyzer"
            ),

            InsightCategory.TIME

        )