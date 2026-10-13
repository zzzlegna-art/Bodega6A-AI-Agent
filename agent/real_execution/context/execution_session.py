
class ExecutionSession:
    def __init__(self, request):
        self.data = {
            "request": request,
            "steps": [],
            "results": []
        }

    def add_step(self, step):
        self.data["steps"].append(step)

    def add_result(self, result):
        self.data["results"].append(result)

    def get_session(self):
        return self.data
