
from pathlib import Path
import shutil

def create_backup(file_path: str):
    source = Path(file_path)
    backup = source.with_suffix(source.suffix + ".bak")
    shutil.copy2(source, backup)
    return str(backup)
