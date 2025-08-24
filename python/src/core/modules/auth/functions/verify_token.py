# Import built-in libraries
import time

# Import external libraries
import jwt
from jwcrypto import jwk

# Import from core
from core.error import is_standard_error, AppError
from core.context.internal_context import initialize_internal_context

# Import from utils
from core.error import is_standard_error
from utils.configs import Configs

# Import helpers
from core.modules.auth.helpers import (
    get_authorization_token,
    get_public_keys,
    get_info_from_claims,
)


def verify_token(ctx):
    """Xác thực token và trả về kết quả xác thực và claims (nếu thành công).

    Args:
        token (str): token

    Raises:
        ValueError: ném ra lỗi nếu như header của JWT Token là không hợp lệ
        ValueError: ném ra lỗi nếu như không tìm thấy Public Key
        ValueError: ném ra lỗi nếu như token được tạo ra không phải là từ
        Cognito Provider nguồn

    Returns:
        dict: kết quả xác thực
    """
    try:
        # Setup context before go further
        in_ctx = initialize_internal_context()
        in_ctx.params["headers"] = ctx.get_headers()
        in_ctx.options["can_catch_error"] = True

        token = get_authorization_token(ctx)

        keys = get_public_keys()

        if is_standard_error(keys):
            return keys

        decoded_header = jwt.get_unverified_header(token)
        kid = decoded_header.get("kid")

        if not kid:
            err = AppError("Token is invalid")
            err.add_error_detail(
                {"source": "verify_token", "desc": "Kid of token not found"}
            )
            err.as_http_error("Unauthorized")
            return err

        key = next((k for k in keys if k["kid"] == kid), None)
        if not key:
            err = AppError("Token is invalid")
            err.add_error_detail(
                {"source": "verify_token", "desc": "Public key not found"}
            )
            err.as_http_error("Unauthorized")
            return err

        jwk_key = jwk.JWK(**key)
        public_key_pem = jwk_key.export_to_pem()

        claims = jwt.decode(
            token,
            public_key_pem,
            algorithms=["RS256"],
            options={"verify_exp": True},
        )

        # Post check claims
        if int(time.time()) > claims.exp:
            err = AppError("Token is invalid")
            err.add_error_detail({"source": "verify_token", "desc": "Token is expired"})
            err.as_http_error("Unauthorized")
            return err

        if claims.get("client_id") != Configs.Cognito_App_Client_Id:
            err = AppError("Token is invalid")
            err.add_error_detail(
                {
                    "source": "verify_token",
                    "desc": "Token was not issued for this audience",
                }
            )
            err.as_http_error("Unauthorized")
            return err

        return claims

    except Exception as e:
        if is_standard_error(e):
            return e

        err = AppError("Verify token failed")
        err.add_error_detail({"source": "verify_token", "desc": str(e)})
        err.as_http_error("InternalServerError")
        return err


def create_verify_token_step_executor(pipeline):
    """Tạo ra một step executor có gán pipeline trong đó để xác thực token.

    Args:
        class: pipeline

    Returns:
        Callable: executor của step.
    """

    def executor(ctx):
        result = verify_token(ctx)

        if is_standard_error(result):
            # Stop pipeline
            pipeline.stop()

            return ctx.sendError(result)

        ctx.add_temp_data("claims", result)

        return result

    return executor
