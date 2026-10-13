
def prepare_commit(message: str, files: list):
    return {
        "message": message,
        "files": files,
        "status": "ready_for_execution"
    }
