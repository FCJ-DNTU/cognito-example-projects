from typing import Optional

from .detail import BaseErrorDetail, ErrorDetails

HTTPServerErrorDict = {
    "InternalServerError": {
        "Status": 500,
        "Code": "INTERNAL_SERVER_ERROR",
    },
    "NotImplemented": {
        "Status": 501,
        "Code": "NOT_IMPLEMENTED",
    },
    "BadGateway": {
        "Status": 502,
        "Code": "BAD_GATEWAY",
    },
    "ServiceUnavailable": {
        "Status": 503,
        "Code": "SERVICE_UNAVAILABLE",
    },
    "GatewayTimeout": {
        "Status": 504,
        "Code": "GATEWAY_TIMEOUT",
    },
    "HttpVersionNotSupported": {
        "Status": 505,
        "Code": "HTTP_VERSION_NOT_SUPPORTED",
    },
}


class AppError(Exception):
    """
    Lớp định nghĩa lỗi từ App hoặc phản hồi từ App.
    """

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        code: Optional[str] = None,
        details: Optional[ErrorDetails] = None,
    ):
        super().__init__(message)

        self.status_code = status_code
        self.code = code
        self.details = details

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

    def add_error_detail(self, detail: BaseErrorDetail):
        """
        Thêm chi tiết lỗi vào tổng lỗi.

        @param detail - chi tiết lỗi.

        @returns
        """
        if not self.details:
            self.details = {"reasons": [detail]}
        elif "reasons" not in self.details or self.details["reasons"] is None:
            self.details["reasons"] = [detail]
        else:
            self.details["reasons"].append(detail)

    def as_http_error(self, name: str):
        """
        Xem error này chính là HTTP Error.

        @param name - tên loại của HTTP Error.
        """
        if name not in HTTPServerErrorDict:
            raise ValueError(f"Unknown HTTP error type: {name}")

        self.status_code = HTTPServerErrorDict[name]["Status"]
        self.code = HTTPServerErrorDict[name]["Code"]

    def to_plain(self):
        """
        Trả về error là một plain object.

        @returns
        """
        return {
            "message": str(self),
            "code": self.code,
            "details": self.details,
        }
