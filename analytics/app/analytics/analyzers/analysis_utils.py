from __future__ import annotations

import math
from collections import OrderedDict

import numpy as np
import pandas as pd
from pandas.api.types import is_bool_dtype, is_datetime64_any_dtype, is_numeric_dtype
from pandas import DataFrame, Series

from app.analytics.models.correlation_pair import CorrelationPair
from app.analytics.models.distribution_item import DistributionItem
from app.analytics.models.percentile_point import PercentilePoint


def numeric_columns(df: DataFrame) -> list[str]:
    return [
        column
        for column in df.columns
        if is_numeric_dtype(df[column]) and not is_bool_dtype(df[column])
    ]


def datetime_columns(df: DataFrame, columns: list[str]) -> list[str]:
    return [
        column
        for column in columns
        if column in df.columns and is_datetime64_any_dtype(df[column])
    ]


def numeric_series(series: Series) -> Series:
    return pd.to_numeric(series, errors="coerce").dropna()


def percentage(part: float, total: float) -> float:
    if total == 0:
        return 0.0

    return round((part / total) * 100, 4)


def share(part: float, total: float) -> float:
    if total == 0:
        return 0.0

    return round(part / total, 4)


def distribution_items(
    series: Series,
    ascending: bool = False,
    top_n: int | None = None
) -> list[DistributionItem]:

    values = series.dropna().astype(str).value_counts(ascending=ascending)
    total = float(values.sum())

    items: list[DistributionItem] = []

    for index, (label, count) in enumerate(values.items(), start=1):
        items.append(
            DistributionItem(
                label=label,
                count=float(count),
                share=share(float(count), total),
                rank=index,
            )
        )

    if top_n is not None:
        return items[:top_n]

    return items


def mode_value(series: Series) -> float | None:
    try:
        mode_series = pd.to_numeric(series, errors="coerce").dropna().mode()
        if mode_series.empty:
            return None

        return float(mode_series.iloc[0])
    except Exception:
        return None


def histogram_items(series: Series, bins: int = 10) -> list[DistributionItem]:
    numeric = numeric_series(series)
    if numeric.empty:
        return []

    counts, edges = np.histogram(numeric, bins=min(bins, max(1, numeric.nunique())))
    total = float(counts.sum())

    items: list[DistributionItem] = []

    for index, count in enumerate(counts, start=1):
        left = edges[index - 1]
        right = edges[index]
        items.append(
            DistributionItem(
                label=f"{left:.2f}-{right:.2f}",
                count=float(count),
                share=share(float(count), total),
                rank=index,
            )
        )

    return items


def percentile_points(series: Series, percentiles: list[float]) -> list[PercentilePoint]:
    numeric = numeric_series(series)
    if numeric.empty:
        return []

    values = numeric.quantile(percentiles)

    return [
        PercentilePoint(percentile=float(percentile), value=float(values.loc[percentile]))
        for percentile in percentiles
    ]


def entropy(series: Series) -> float | None:
    values = series.dropna().astype(str).value_counts(normalize=True)
    if values.empty:
        return None

    return float(-sum(prob * math.log(prob, 2) for prob in values if prob > 0))


def correlation_pairs(corr: DataFrame, threshold: float = 0.7) -> tuple[list[CorrelationPair], list[CorrelationPair]]:
    strong = []
    negative = []

    columns = list(corr.columns)

    for i, left in enumerate(columns):
        for right in columns[i + 1 :]:
            coefficient = float(corr.loc[left, right])

            if coefficient >= threshold:
                strong.append(
                    CorrelationPair(
                        column_x=left,
                        column_y=right,
                        coefficient=coefficient,
                    )
                )
            elif coefficient <= -threshold:
                negative.append(
                    CorrelationPair(
                        column_x=left,
                        column_y=right,
                        coefficient=coefficient,
                    )
                )

    return strong, negative


def safe_linear_trend(y: Series) -> float | None:
    numeric = numeric_series(y)
    if len(numeric) < 2:
        return None

    x = np.arange(len(numeric), dtype=float)
    slope = np.polyfit(x, numeric.to_numpy(dtype=float), 1)[0]
    return float(slope)


def iqr_bounds(series: Series) -> tuple[float | None, float | None, float | None]:
    numeric = numeric_series(series)
    if numeric.empty:
        return None, None, None

    q1 = float(numeric.quantile(0.25))
    q3 = float(numeric.quantile(0.75))
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return lower, upper, iqr


def top_bottom_items(series: Series, top_n: int = 5) -> tuple[list[DistributionItem], list[DistributionItem]]:
    values = series.dropna().astype(str).value_counts()
    total = float(values.sum())

    top_items = [
        DistributionItem(
            label=label,
            count=float(count),
            share=share(float(count), total),
            rank=index,
        )
        for index, (label, count) in enumerate(values.head(top_n).items(), start=1)
    ]

    bottom_items = [
        DistributionItem(
            label=label,
            count=float(count),
            share=share(float(count), total),
            rank=index,
        )
        for index, (label, count) in enumerate(values.tail(top_n).items(), start=max(1, len(values) - top_n + 1))
    ]

    return top_items, bottom_items