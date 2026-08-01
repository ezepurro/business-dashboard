from abc import ABC, abstractmethod

from insights.models.insight import Insight
from app.profiling.models.dataset_profile import DatasetProfile


class BaseInsightBuilder(ABC):

    @abstractmethod
    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        pass