
class AccessControl:
    def verify(self, identity, action):
        return {
            "identity": identity,
            "action": action,
            "permission": "evaluated"
        }
