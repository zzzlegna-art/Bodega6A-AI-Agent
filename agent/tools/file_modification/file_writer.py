
from pathlib import Path

def write_file(file_path: str, content: str):
    path = Path(file_path)
    path.write_text(content, encoding="utf-8")
    return {
        "file": str(path),
        "status": "written"
    }
