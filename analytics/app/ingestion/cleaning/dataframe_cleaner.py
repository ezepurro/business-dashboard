from pandas import DataFrame


class DataFrameCleaner:

    def clean(
        self,
        df: DataFrame
    ) -> DataFrame:

        # Eliminar columnas completamente vacías
        df = df.dropna(
            axis=1,
            how="all"
        )

        # Eliminar filas completamente vacías
        df = df.dropna(
            axis=0,
            how="all"
        )

        # Reiniciar índices
        df = df.reset_index(
            drop=True
        )

        return df