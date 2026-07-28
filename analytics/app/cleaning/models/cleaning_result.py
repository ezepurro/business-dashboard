from pandas import DataFrame
from pydantic import BaseModel, ConfigDict, field_serializer

from app.cleaning.models.cleaning_action import CleaningAction


class CleaningResult(BaseModel):

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )

    dataframe: DataFrame

    actions: list[CleaningAction]

    @field_serializer("dataframe")
    def serialize_dataframe(
        self,
        dataframe: DataFrame
    ) -> list[dict]:
        return dataframe.to_dict(orient="records")