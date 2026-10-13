
class GitWorkflowManager:
    def execute(self, change):
        return {
            "change": change,
            "steps": [
                "branch",
                "commit",
                "review",
                "merge"
            ],
            "status": "ready"
        }
