
class IncidentResponse:
    def respond(self, incident):
        return {
            "incident": incident,
            "response": "prepared",
            "status": "ready"
        }
