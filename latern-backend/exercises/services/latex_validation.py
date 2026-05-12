# This module provides functions for validating and normalizing LaTeX strings.
def normalize_latex(value: str) -> str:
    return value.strip().replace(" ", "").replace("\\wedge", "\\land")
