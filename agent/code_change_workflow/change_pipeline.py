
class ChangePipeline:
    def run(self, change):
        return {
            "change": change,
            "pipeline": [
                "modification",
                "diff",
                "validation",
                "commit"
            ],
            "status": "ready"
        }
