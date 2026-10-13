
class ToolExecutionBridge:
    def __init__(self, tool_registry=None):
        self.tool_registry = tool_registry

    def execute_tool(self, tool_name, payload):
        tool = self.tool_registry.get_tool(tool_name)

        if tool is None:
            return {
                "status": "error",
                "message": "tool_not_found"
            }

        return tool.execute(payload)
