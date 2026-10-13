
def validate_change(original: str, modified: str):
    return {
        "valid": original != modified,
        "original_length": len(original),
        "modified_length": len(modified)
    }
