from insights.models.executive_summary import ExecutiveSummary
from app.profiling.models.dataset_profile import DatasetProfile


class ExecutiveSummaryBuilder:

    def build(
        self,
        profile: DatasetProfile,
        insights: list
    ) -> ExecutiveSummary:

        return ExecutiveSummary()