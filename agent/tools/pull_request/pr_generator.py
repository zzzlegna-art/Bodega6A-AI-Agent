
def create_pull_request(title: str, description: str, branch: str):
    return {
        "title": title,
        "description": description,
        "branch": branch,
        "status": "prepared"
    }
