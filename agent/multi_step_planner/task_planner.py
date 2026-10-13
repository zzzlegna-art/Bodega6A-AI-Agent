
class MultiStepPlanner:
    def create_plan(self, task):
        return {
            "task": task,
            "steps": [],
            "status": "planned"
        }
