
def create_release(version: str, changes: list):
    return {
        "version": version,
        "changes": changes,
        "status": "prepared"
    }
