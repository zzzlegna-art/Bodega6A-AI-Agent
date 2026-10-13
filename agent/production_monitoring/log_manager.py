
class LogManager:
    def record(self, event):
        return {
            "event": event,
            "logged": True,
            "status": "stored"
        }
