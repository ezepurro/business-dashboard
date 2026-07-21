import re
import unicodedata


def normalize_column_name(name: str) -> str:
    name = name.strip().lower()

    # quitar acentos
    name = unicodedata.normalize('NFKD', name)
    name = ''.join(c for c in name if not unicodedata.combining(c))

    # reemplazar separadores por espacio
    name = re.sub(r'[_\\-]+', ' ', name)

    # quitar espacios múltiples
    name = re.sub(r'\\s+', ' ', name)

    return name