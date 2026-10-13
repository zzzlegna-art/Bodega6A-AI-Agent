
class RollbackManager:
    def prepare(self, deployment):
        return {
            "deployment": deployment,
            "rollback_plan": "prepared",
            "status": "ready"
        }
