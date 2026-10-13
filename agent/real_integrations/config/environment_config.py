
import os

class EnvironmentConfig:
    def get(self, key, default=None):
        return os.getenv(key, default)
