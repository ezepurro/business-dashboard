from app.profiling.models.dataset_profile import DatasetProfile


class ProfileExporter:

    def export(
        self,
        profile: DatasetProfile
    ) -> dict:

        return {

            "metadata": profile.metadata.model_dump(),

            "quality": profile.quality.model_dump(),

            "sample": profile.sample[:3],

            "missing_values": {
                
                column: count

                for column, count in profile.missing_values.items()

                if count > 0
            },

            "cleaning": {

                "actions": [

                    action.model_dump()

                    for action in profile.cleaning.actions

                ]

            },

            "transformation": {

                "actions": [

                    action.model_dump()

                    for action in (

                        profile.transformation.actions

                        if profile.transformation

                        else []

                    )

                ]

            },

            "analytics": {

                "charts": [

                    chart.model_dump()

                    for chart in (

                        profile.analytics.charts

                        if profile.analytics

                        else []

                    )

                ]

            },

            "insights": (

                profile.insights.model_dump()

                if profile.insights

                else None

            )

        }