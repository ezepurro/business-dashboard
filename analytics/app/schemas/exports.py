from pydantic import BaseModel

from app.cleaning.models.cleaning_action import CleaningAction
from app.transformation.models.transformation_action import TransformationAction
from app.analytics.models.chart_data import ChartData
from app.insights.models.insight_report import InsightReport


class CleaningExport(BaseModel):
    actions: list[CleaningAction]


class TransformationExport(BaseModel):
    actions: list[TransformationAction]


class AnalyticsExport(BaseModel):
    charts: list[ChartData]