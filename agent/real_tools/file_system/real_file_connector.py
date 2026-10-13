
from pathlib import Path

class RealFileConnector:
    def read_file(self, path):
        return Path(path).read_text(encoding="utf-8")

    def write_file(self, path, content):
        Path(path).write_text(content, encoding="utf-8")
        return {
            "path": path,
            "status": "written"
        }
