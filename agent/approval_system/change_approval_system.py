
class ChangeApprovalSystem:
    def review(self, change):
        return {
            "change": change,
            "status": "pending_approval"
        }
