from pydantic import BaseModel

from app.analytics.models.time_series_data import TimeSeriesData


class TimeSummary(BaseModel):

    date_column: str

    value_column: str | None = None

    daily: TimeSeriesData | None = None

    weekly: TimeSeriesData | None = None

    monthly: TimeSeriesData | None = None

    quarterly: TimeSeriesData | None = None

    yearly: TimeSeriesData | None = None

    growth_rate: float | None = None

    trend_slope: float | None = None

    seasonality_index: float | None = None