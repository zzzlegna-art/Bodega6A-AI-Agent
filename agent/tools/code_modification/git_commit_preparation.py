"""Prepare commit metadata.

This stage only prepares commit information.
Actual Git execution requires approval.
"""


def prepare_commit(message: str, files: list[str]):
    return {
        "message": message,
        "files": files,
        "status": "awaiting_approval",
    }
