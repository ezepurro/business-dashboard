from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.executive_summary import ExecutiveSummary
from app.insights.models.insight import Insight
from app.insights.models.insight_priority import InsightPriority

from app.profiling.models.dataset_profile import DatasetProfile


class ExecutiveSummaryBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile,
        insights: list[Insight]
    ) -> ExecutiveSummary:

        quality_score = profile.quality.overall_score

        critical = sum(

            1

            for insight in insights

            if insight.priority == InsightPriority.CRITICAL

        )

        high = sum(

            1

            for insight in insights

            if insight.priority == InsightPriority.HIGH

        )

        top_strengths = [

            insight.title

            for insight in insights

            if insight.priority in (

                InsightPriority.LOW,
                InsightPriority.INFO

            )

        ][:3]

        top_risks = [

            insight.title

            for insight in insights

            if insight.priority in (

                InsightPriority.CRITICAL,
                InsightPriority.HIGH

            )

        ][:3]

        recommendations = []

        if critical > 0:

            recommendations.append(

                "Resolver primero los problemas críticos detectados."

            )

        elif high > 0:

            recommendations.append(

                "Priorizar la resolución de los insights de alta prioridad."

            )

        else:

            recommendations.append(

                "El dataset presenta un buen estado general."

            )

        recommendations.append(

            "Utilizar las métricas del Analytics Engine para profundizar el análisis."

        )

        dataset_score = quality_score

        if critical:

            dataset_score -= critical * 10

        if high:

            dataset_score -= high * 5

        dataset_score = max(
            0,
            min(
                dataset_score,
                100
            )
        )

        return ExecutiveSummary(

            title="Resumen Ejecutivo",

            description = (

                f"Se analizaron {profile.rows} registros "

                f"y {profile.columns} columnas. "

                f"El dataset obtuvo un puntaje de calidad "

                f"de {profile.quality.overall_score:.1f}/100. "

                f"Se generaron {len(insights)} insights "

                f"distribuidos en distintas áreas del negocio."

            ),

            total_insights=len(insights),

            dataset_score=round(dataset_score, 1),

            quality_score=profile.quality.overall_score,

            total_rows=profile.rows,

            total_columns=profile.columns,

            critical_insights=critical,

            high_priority_insights=high,

            top_strengths=top_strengths,

            top_risks=top_risks,

            recommendations=recommendations

        )