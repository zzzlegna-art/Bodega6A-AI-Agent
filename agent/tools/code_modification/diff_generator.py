"""Generate a controlled diff between original and proposed content."""

import difflib


def generate_diff(original: str, modified: str, filename: str = "file"):
    return "".join(
        difflib.unified_diff(
            original.splitlines(True),
            modified.splitlines(True),
            fromfile=f"{filename}:original",
            tofile=f"{filename}:modified",
        )
    )
