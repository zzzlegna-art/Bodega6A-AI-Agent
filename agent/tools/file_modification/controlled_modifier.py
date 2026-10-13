
from .backup_manager import create_backup
from .file_writer import write_file
from .change_validator import validate_change

def modify_file(file_path: str, original: str, modified: str):
    validation = validate_change(original, modified)

    if not validation["valid"]:
        return {
            "status": "rejected",
            "reason": "No change detected"
        }

    backup = create_backup(file_path)
    result = write_file(file_path, modified)

    return {
        "status": "completed",
        "backup": backup,
        "result": result,
        "validation": validation
    }
