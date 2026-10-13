"""Create a change proposal before writing files."""


def create_patch_proposal(file_path: str, diff: str):
    return {
        "file": file_path,
        "diff": diff,
        "status": "pending_review",
    }
