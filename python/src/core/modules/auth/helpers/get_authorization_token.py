# Import errors
from core.error import AppError, ClientError, is_standard_error


def get_authorization_token(ctx) -> str | None:
    """
    Lấy token từ trong headers. Mặc định sẽ lấy Bearer token.

    Args:
        ctx: internal context

    Returns:
        str: bearer token
    """
    headers = ctx.params.get("headers")

    # Lấy Authorization header (ưu tiên chuẩn, fallback lowercase)
    auth_header = headers.get("Authorization") or headers.get("authorization") or None

    try:
        if not auth_header or not auth_header.startswith("Bearer "):
            err = ClientError("Missing or invalid Authorization header")
            err.add_error_detail({"source": "get_authorization_token"})
            err.as_http_error("BadRequest")
            raise err

        parts = auth_header.split(" ", 1)
        token = parts[1] if len(parts) > 1 else None

        if token is None:
            err = ClientError("Bearer token not found")
            err.add_error_detail({"source": "get_authorization_token"})
            err.as_http_error("BadRequest")
            raise err

        return token
    except Exception as e:
        if not is_standard_error(e):
            msg = str(e)
            e = AppError("Cannot get token from authorization header")
            e.add_error_detail({"source": "get_authorization_token", "desc": msg})
            e.as_http_error("InternalServerError")

        if ctx.options.get("can_catch_error"):
            raise e

        return None
