
class AutomationController:
    def __init__(self):
        self.steps = []

    def register_step(self, name):
        self.steps.append(name)

    def get_workflow(self):
        return self.steps
