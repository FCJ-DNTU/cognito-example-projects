import boto3

# Import from core
from core.error.main import AppError, is_standard_error

# Import from utils
from utils.aws_clients.main import get_cognito_idp_client
from utils.configs import Configs


def refresh_tokens(ctx):
    """
    Cho phép người dùng có thể làm mới lại các tokens.

    Args:
        ctx: runtime context
    Returns:
        dict: chứa tokens hoặc AppError
    """
    try:
        body = ctx.get_body()
        refresh_token = body.get("refreshToken")

        client = get_cognito_idp_client()

        response = client.initiate_auth(
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={"REFRESH_TOKEN": refresh_token},
            ClientId=Configs.Cognito_App_Client_Id,
        )

        auth_result = response.get("AuthenticationResult", {})

        return {
            "auth": {
                "idToken": auth_result.get("IdToken"),
                "accessToken": auth_result.get("AccessToken"),
                "expiresIn": auth_result.get("ExpiresIn"),
            }
        }

    except Exception as error:
        if is_standard_error(error):
            return error

        err = AppError("Cannot refresh tokens")
        err.as_http_error("InternalServerError")
        err.add_error_detail({"source": "refreshToken", "desc": str(error)})

        return err
