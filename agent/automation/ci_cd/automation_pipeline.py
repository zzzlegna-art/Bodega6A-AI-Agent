
class AutomationPipeline:
    def run(self, project):
        return {
            "project": project,
            "steps": [
                "build",
                "test",
                "deploy"
            ],
            "status": "pipeline_ready"
        }
