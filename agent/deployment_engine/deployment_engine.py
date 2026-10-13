
class DeploymentEngine:
    def prepare(self, project):
        return {
            "project": project,
            "deployment": "prepared",
            "status": "ready"
        }

    def deploy(self, project):
        return {
            "project": project,
            "deployment": "executed",
            "status": "completed"
        }
