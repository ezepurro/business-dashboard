import re


def collapse_spaces(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def normalize_lookup_key(value: str) -> str:
    return collapse_spaces(value).casefold()


def title_text(value: str) -> str:
    compact = collapse_spaces(value)

    compact = re.sub(r"([a-z])([A-Z])", r"\1 \2", compact)

    return compact.title()