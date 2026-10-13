
class AgentCommunicationProtocol:
    def send_message(self, sender, receiver, message):
        return {
            "sender": sender,
            "receiver": receiver,
            "message": message,
            "status": "sent"
        }
