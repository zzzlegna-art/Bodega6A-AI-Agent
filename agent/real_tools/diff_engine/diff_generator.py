
class DiffGenerator:
    def generate(self, original, modified):
        return {
            "original": original,
            "modified": modified,
            "diff": "generated",
            "status": "ready"
        }
