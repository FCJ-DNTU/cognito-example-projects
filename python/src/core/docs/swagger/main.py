from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

# Import constant
from utils.constants.app import APP_CONSTANTS
from utils.configs import Configs

app_info = {
    "title": "Cognito Example Application with Python",
    "version": "1.0.0",
    "description": "Tài liệu API cho Cognito Example Application with Python",
}


def create_custom_openapi_schema(app: FastAPI):
    """Tạo cấu hình FastAPI theo chuẩn của OpenAPI.

    Args:
        FastAPI: instance của FastAPI.

    Returns:
        _: schema theo chuẩn open api.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app_info.get("title", ""),
        version=app_info.get("version", ""),
        description=app_info.get("description", ""),
        routes=app.routes,
    )

    if "components" not in openapi_schema:
        openapi_schema["components"] = {}

    # Thêm security schemes (tương đương components.securitySchemes)
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Thêm global security (tương đương security)
    openapi_schema["security"] = [{"bearerAuth": []}]

    # Thêm servers (tương đương servers)
    openapi_schema["servers"] = [
        {
            "url": f"http://{Configs.Swagger_Server_Config_Host}:{APP_CONSTANTS.get("PORT")}",
            "description": "Development server",
        }
    ]

    app.openapi_schema = openapi_schema

    return app.openapi_schema
