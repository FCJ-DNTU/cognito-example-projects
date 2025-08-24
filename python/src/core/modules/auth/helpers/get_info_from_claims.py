from typing import Any, Dict


def get_info_from_claims(claims: Dict[str, Any]) -> Dict[str, Any]:
    """
    Tổng hợp và lấy thông tin người dùng trong cognito claims.

    Args:
        claims (Dict[str, Any]): cognito claims.
    Return:
        dict: chứa username, team, role.
    """
    return {
        "username": claims.get("username"),
        "team": claims.get("cognito:groups", [None])[0],
        "role": claims.get("custom:role"),
    }
