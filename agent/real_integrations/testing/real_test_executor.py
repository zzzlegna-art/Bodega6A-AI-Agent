
import subprocess

class RealTestExecutor:
    def run(self, command):
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )

        return {
            "output": result.stdout,
            "errors": result.stderr,
            "success": result.returncode == 0
        }
