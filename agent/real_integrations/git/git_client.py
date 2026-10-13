
import subprocess

class GitClient:
    def run(self, command):
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )

        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "code": result.returncode
        }

    def status(self):
        return self.run("git status")

    def diff(self):
        return self.run("git diff")

    def commit(self, message):
        return self.run(f'git commit -m "{message}"')
