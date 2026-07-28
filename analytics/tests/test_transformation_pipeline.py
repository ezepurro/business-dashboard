import unittest

import pandas as pd

from app.profiling.models.column_metadata import ColumnMetadata
from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.transformation_engine import TransformationEngine
from app.transformation.transformers.boolean_transformer import BooleanTransformer
from app.transformation.transformers.category_transformer import CategoryTransformer
from app.transformation.transformers.date_transformer import DateTransformer
from app.transformation.transformers.enum_transformer import EnumTransformer
from app.transformation.transformers.geographic_transformer import GeographicTransformer
from app.transformation.transformers.identifier_transformer import IdentifierTransformer
from app.transformation.transformers.numeric_transformer import NumericTransformer
from app.transformation.transformers.unit_transformer import UnitTransformer


def build_metadata(df: pd.DataFrame, semantic_types: dict[str, str]) -> DatasetMetadata:
    return DatasetMetadata(
        rows=len(df),
        columns=len(df.columns),
        data_dictionary=[
            ColumnMetadata(
                name=column,
                semantic_type=semantic_types.get(column, "unknown"),
                confidence=0.95,
                dtype=str(df[column].dtype),
                nullable=bool(df[column].isna().any()),
                null_percentage=float(df[column].isna().mean()),
                unique_values=int(df[column].nunique(dropna=True)),
                sample_values=df[column].dropna().head(5).tolist(),
            )
            for column in df.columns
        ],
    )


class TransformationPipelineTests(unittest.TestCase):

    def test_boolean_transformer(self):
        df = pd.DataFrame({"flag": ["Si", "NO", "TRUE", "0", None]})
        metadata = build_metadata(df, {"flag": "boolean"})

        result = BooleanTransformer().transform(df, metadata)

        self.assertEqual(str(result.dataframe["flag"].dtype), "boolean")
        self.assertEqual(result.dataframe["flag"].tolist(), [True, False, True, False, pd.NA])
        self.assertEqual(result.actions[0].transformation, "convert_boolean")

    def test_date_transformer(self):
        df = pd.DataFrame({"fecha": ["01/01/2025", "2025-01-02", "01-01-25", "texto"]})
        metadata = build_metadata(df, {"fecha": "date"})

        result = DateTransformer().transform(df, metadata)

        self.assertTrue(pd.api.types.is_datetime64_any_dtype(result.dataframe["fecha"]))
        self.assertEqual(result.dataframe["fecha"].notna().sum(), 3)
        self.assertEqual(result.actions[0].transformation, "convert_datetime")

    def test_numeric_transformer(self):
        df = pd.DataFrame({"monto": ["$120", "$1.250,30", "10%", "1.200"]})
        metadata = build_metadata(df, {"monto": "money"})

        result = NumericTransformer().transform(df, metadata)

        self.assertEqual(str(result.dataframe["monto"].dtype), "Float64")
        self.assertAlmostEqual(float(result.dataframe.loc[0, "monto"]), 120.0, places=3)
        self.assertAlmostEqual(float(result.dataframe.loc[1, "monto"]), 1250.30, places=3)
        self.assertAlmostEqual(float(result.dataframe.loc[2, "monto"]), 0.10, places=3)
        self.assertAlmostEqual(float(result.dataframe.loc[3, "monto"]), 1200.0, places=3)

    def test_category_transformer(self):
        df = pd.DataFrame({"estado": ["Activo", "Inactivo", "Activo", "Activo", "Inactivo"]})
        metadata = build_metadata(df, {"estado": "unknown"})

        result = CategoryTransformer().transform(df, metadata)

        self.assertEqual(str(result.dataframe["estado"].dtype), "category")
        self.assertEqual(result.actions[0].transformation, "convert_category")

    def test_identifier_transformer(self):
        df = pd.DataFrame({"id_pedido": [1, 2.0, "003", None]})
        metadata = build_metadata(df, {"id_pedido": "identifier"})

        result = IdentifierTransformer().transform(df, metadata)

        self.assertEqual(str(result.dataframe["id_pedido"].dtype), "string")
        self.assertEqual(result.dataframe["id_pedido"].tolist(), ["1", "2", "003", pd.NA])

    def test_enum_transformer(self):
        df = pd.DataFrame({"canal": ["online", "PRESENCIAL", "web", "tienda"]})
        metadata = build_metadata(df, {"canal": "channel"})

        result = EnumTransformer().transform(df, metadata)

        self.assertEqual(str(result.dataframe["canal"].dtype), "category")
        self.assertEqual(result.dataframe["canal"].tolist(), ["Online", "Presencial", "Online", "Presencial"])

    def test_unit_transformer(self):
        df = pd.DataFrame({"peso": ["15 kg", "10kg", "22 litros", None]})
        metadata = build_metadata(df, {"peso": "numeric_measure"})

        result = UnitTransformer().transform(df, metadata)

        self.assertNotIn("peso", result.dataframe.columns)
        self.assertIn("peso_value", result.dataframe.columns)
        self.assertIn("peso_unit", result.dataframe.columns)
        self.assertAlmostEqual(float(result.dataframe.loc[0, "peso_value"]), 15.0, places=3)
        self.assertEqual(result.dataframe.loc[0, "peso_unit"], "kg")

    def test_geographic_transformer(self):
        df = pd.DataFrame({"ubicacion": ["Bs As", "CABA", "capital federal", "Rosario"]})
        metadata = build_metadata(df, {"ubicacion": "location"})

        result = GeographicTransformer().transform(df, metadata)

        self.assertEqual(result.dataframe["ubicacion"].tolist()[0], "Buenos Aires")
        self.assertEqual(result.dataframe["ubicacion"].tolist()[1], "Ciudad Autonoma De Buenos Aires")

    def test_transformation_engine_integration(self):
        df = pd.DataFrame(
            {
                "id_pedido": ["001", "002", "003"],
                "fidelizado": ["Si", "No", "TRUE"],
                "fecha": ["01/01/2025", "2025-01-02", "2025/01/03"],
                "monto": ["$120", "$1.250,30", "10%"],
                "canal": ["mercado pago", "MERCADOPAGO", "Transferencia"],
                "region": ["north", "sur", "Centro"],
                "peso": ["15 kg", "10 kg", "20 kg"],
                "estado": ["activo", "inactivo", "activo"],
            }
        )

        metadata = build_metadata(
            df,
            {
                "id_pedido": "identifier",
                "fidelizado": "boolean",
                "fecha": "date",
                "monto": "money",
                "canal": "payment_method",
                "region": "region",
                "peso": "numeric_measure",
                "estado": "status",
            },
        )

        report = TransformationEngine().transform(df, metadata)

        self.assertIn("id_pedido", report.dataframe.columns)
        self.assertEqual(str(report.dataframe["id_pedido"].dtype), "string")
        self.assertEqual(str(report.dataframe["fidelizado"].dtype), "boolean")
        self.assertTrue(pd.api.types.is_datetime64_any_dtype(report.dataframe["fecha"]))
        self.assertEqual(str(report.dataframe["monto"].dtype), "Float64")
        self.assertEqual(str(report.dataframe["canal"].dtype), "category")
        self.assertEqual(str(report.dataframe["region"].dtype), "category")
        self.assertIn("peso_value", report.dataframe.columns)
        self.assertIn("peso_unit", report.dataframe.columns)

        transformations = {action.transformation for action in report.actions}
        self.assertIn("preserve_identifier_as_string", transformations)
        self.assertIn("split_value_and_unit", transformations)
        self.assertIn("convert_boolean", transformations)
        self.assertIn("convert_datetime", transformations)
        self.assertIn("convert_numeric", transformations)
        self.assertIn("normalize_enum", transformations)


if __name__ == "__main__":
    unittest.main()