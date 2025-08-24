# Import from core
from core.error.main import AppError, is_standard_error

# Import from utils
from utils.aws_clients.main import get_cognito_idp_client
from utils.configs import Configs


async def sign_in(ctx):
    """
    Cho phép một người dùng đăng nhập vào trong hệ thống.

    Args:
        ctx: runtime context

    Returns:
        dict: chứa tokens hoặc AppError
    """
    try:
        body = await ctx.get_body()
        username = body.get("username")
        password = body.get("password")

        print("Body:", body)
        print("Path Params:", ctx.get_params())
        print("Query:", ctx.get_query())

        client = get_cognito_idp_client()

        response = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password,
            },
            ClientId=Configs.Cognito_App_Client_Id,
        )

        auth_result = response.get("AuthenticationResult", {})

        return {
            "auth": {
                "idToken": auth_result.get("IdToken"),
                "accessToken": auth_result.get("AccessToken"),
                "refreshToken": auth_result.get("RefreshToken"),
                "expiresIn": auth_result.get("ExpiresIn"),
            }
        }

    except Exception as error:
        if is_standard_error(error):
            return error

        err = AppError("Cannot authenticate user")
        err.as_http_error("InternalServerError")
        err.add_error_detail({"source": "signIn", "desc": str(error)})

        return err
