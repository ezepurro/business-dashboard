from insights.builders.base_builder import BaseInsightBuilder

from insights.models.insight import Insight
from app.profiling.models.dataset_profile import DatasetProfile


class GeographicBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        return []