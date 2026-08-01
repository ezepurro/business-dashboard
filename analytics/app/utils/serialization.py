from __future__ import annotations

from collections.abc import Mapping, Sequence
from datetime import date, datetime
from decimal import Decimal
import math
from typing import Any

import numpy as np
import pandas as pd


def normalize_json_value(value: Any) -> Any:
    if value is None:
        return None

    if value is pd.NA or value is pd.NaT:
        return None

    if isinstance(value, bool | int | str):
        return value

    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None

        return value

    if isinstance(value, np.generic):
        return normalize_json_value(value.item())

    if isinstance(value, pd.Timestamp):
        if pd.isna(value):
            return None

        return value.isoformat()

    if isinstance(value, pd.Timedelta):
        if pd.isna(value):
            return None

        return value.isoformat()

    if isinstance(value, datetime | date):
        return value.isoformat()

    if isinstance(value, pd.Period):
        return str(value)

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, np.ndarray):
        return [normalize_json_value(item) for item in value.tolist()]

    if isinstance(value, pd.Series):
        return [normalize_json_value(item) for item in value.tolist()]

    if isinstance(value, pd.DataFrame):
        return normalize_json_records(value.to_dict(orient="records"))

    if isinstance(value, Mapping):
        return {
            str(key): normalize_json_value(item)
            for key, item in value.items()
        }

    if isinstance(value, Sequence) and not isinstance(value, (str, bytes, bytearray)):
        return [normalize_json_value(item) for item in value]

    return value


def normalize_json_record(record: Mapping[str, Any]) -> dict[str, Any]:
    return {
        str(key): normalize_json_value(value)
        for key, value in record.items()
    }


def normalize_json_records(records: Sequence[Mapping[str, Any]]) -> list[dict[str, Any]]:
    return [normalize_json_record(record) for record in records]