from typing import Optional


from .AppError import AppError
from .detail import BaseErrorDetail, ErrorDetails

HTTPClientErrorDict = {
    "BadRequest": {
        "Status": 400,
        "Code": "BAD_REQUEST",
    },
    "Unauthorized": {
        "Status": 401,
        "Code": "UNAUTHORIZED",
    },
    "Forbidden": {
        "Status": 403,
        "Code": "FORBIDDEN",
    },
    "NotFound": {
        "Status": 404,
        "Code": "NOT_FOUND",
    },
    "MethodNotAllowed": {
        "Status": 405,
        "Code": "METHOD_NOT_ALLOWED",
    },
    "RequestTimeout": {
        "Status": 408,
        "Code": "REQUEST_TIMEOUT",
    },
    "Conflict": {
        "Status": 409,
        "Code": "CONFLICT",
    },
    "Gone": {
        "Status": 410,
        "Code": "GONE",
    },
    "UnprocessableEntity": {
        "Status": 422,
        "Code": "UNPROCESSABLE_ENTITY",
    },
    "TooManyRequests": {
        "Status": 429,
        "Code": "TOO_MANY_REQUESTS",
    },
}


class ClientError(AppError):
    """
    Lớp định nghĩa lỗi từ client hoặc là lỗi nội bộ của app.
    """

    def __init__(self, message: str, details: Optional[ErrorDetails] = None):
        super().__init__(
            message,
            HTTPClientErrorDict["BadRequest"]["Status"],
            HTTPClientErrorDict["BadRequest"]["Code"],
            details,
        )

    def as_http_error(self, name: str):
        """
        Xem error này chính là HTTP Error.

        @param name - tên loại của HTTP Error.
        """
        if name not in HTTPClientErrorDict:
            raise ValueError(f"Unknown HTTP client error type: {name}")

        self.status_code = HTTPClientErrorDict[name]["Status"]
        self.code = HTTPClientErrorDict[name]["Code"]

    @staticmethod
    def create_error_detail(source: str, desc: str) -> BaseErrorDetail:
        """
        Tạo ra một base error detail.

        @static
        @returns
        """
        return {
            "source": source,
            "desc": desc,
        }
