
def prepare_deployment(environment: str, version: str):
    return {
        "environment": environment,
        "version": version,
        "status": "deployment_ready"
    }
