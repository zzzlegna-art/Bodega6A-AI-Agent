
class SystemMonitor:
    def collect_metrics(self, system):
        return {
            "system": system,
            "metrics": [
                "availability",
                "performance",
                "errors"
            ],
            "status": "collected"
        }
