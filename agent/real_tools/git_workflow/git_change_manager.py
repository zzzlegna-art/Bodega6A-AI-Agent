
class GitChangeManager:
    def prepare_commit(self, diff):
        return {
            "diff": diff,
            "commit": {
                "message": "AI generated code change",
                "status": "prepared"
            }
        }
