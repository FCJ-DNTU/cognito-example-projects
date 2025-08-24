import os
import requests

from core.error.AppError import AppError

# Import constants
from utils.configs.main import Configs


def get_public_keys():
    """
    Lấy các public keys trong Cognito User Pool.
    Trả về list keys hoặc AppError nếu thất bại.
    """
    region = Configs.Aws_Region
    user_pool_id = Configs.Cognito_User_Pool_Id

    jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"

    try:
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        return data.get("keys", [])
    except requests.RequestException as e:
        err = AppError("Cannot get public keys from Cognito User Pool")
        err.add_error_detail({"source": "get_public_keys", "desc": str(e)})
        err.as_http_error("InternalServerError")

        return err
