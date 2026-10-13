
from pathlib import Path

class CodeModificationEngine:
    def read_target(self, file_path):
        return Path(file_path).read_text(encoding="utf-8")

    def modify(self, file_path, new_content):
        Path(file_path).write_text(new_content, encoding="utf-8")
        return {
            "file": file_path,
            "status": "modified"
        }

    def preview(self, original, modified):
        return {
            "original": original,
            "modified": modified,
            "status": "preview_generated"
        }
