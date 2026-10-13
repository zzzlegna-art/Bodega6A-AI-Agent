
import subprocess

def run_git_command(command):
    result = subprocess.run(
        command,
        shell=True,
        capture_output=True,
        text=True
    )

    return {
        "success": result.returncode == 0,
        "output": result.stdout,
        "error": result.stderr
    }
