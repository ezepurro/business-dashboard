from pydantic import BaseModel

from app.cleaning.models.cleaning_action import CleaningAction


class CleaningReport(BaseModel):

    actions: list[CleaningAction]