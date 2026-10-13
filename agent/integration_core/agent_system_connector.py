
class AgentSystemConnector:
    def __init__(self):
        self.registry = {}

    def connect_module(self, name, module):
        self.registry[name] = module

    def get_connected_modules(self):
        return self.registry

    def broadcast_context(self, context):
        return {
            "context": context,
            "modules_notified": list(self.registry.keys()),
            "status": "distributed"
        }
