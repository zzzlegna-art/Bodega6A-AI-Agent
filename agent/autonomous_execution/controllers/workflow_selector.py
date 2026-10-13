
class WorkflowSelector:
    def select(self, request_type):
        workflows = {
            "code_change": "full_code_change_workflow"
        }

        return {
            "request_type": request_type,
            "workflow": workflows.get(request_type, "general_workflow")
        }
