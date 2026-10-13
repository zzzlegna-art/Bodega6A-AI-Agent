
class ToolAdapter:
    def __init__(self, tool):
        self.tool = tool

    def execute(self, payload):
        return self.tool.execute(payload)
