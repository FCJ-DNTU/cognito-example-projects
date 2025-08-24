from abc import ABC, abstractmethod
from typing import Any, Optional, Union, Dict, Callable, IO
from io import BytesIO

# Import các error types (cần được định nghĩa trong project)
# from error.app_error import AppError
# from error.client_error import ClientError


class RuntimeContext(ABC):
    """
    Trong mỗi runtime khác nhau sẽ có các input khác nhau, vì thế mà
    mình sẽ cần phải tạo ra một tiêu chuẩn để cho core có thể dùng được
    gì từ những runtime đó mà không cần phải sử dụng trực tiếp runtime
    đó trong phần definition của core. Ví dụ như với Express, mình sẽ có
    Request, Response và NextFunction nhưng các runtime khác thì có thể
    sẽ có các chuẩn input khác nhau. Đó là lý do vì sao mà mình phải
    định nghĩa ra Runtime Context để chuẩn hoá.

    Trong này thì mình có thể thấy là context nó bao gồm cả properties
    và methods. Trong đó bạn có thể thấy có nhiều methods lấy input
    (tiền tố get) và có nhiều methods gửi output (tiền tố send).

    Ngoài ra thì còn có một số hàm khác nữa.
    """

    def __init__(
        self,
        runtime: str,
        prev_result: Optional[Any] = None,
        ext_options: Optional[Dict[str, Any]] = None,
    ):
        """
        Khởi tạo Runtime Context

        Args:
            runtime: Name of runtime
            prev_result: Kết quả của lần thực thi trước nếu đang ở trong pipeline
        """
        self.runtime = runtime
        self.prev_result = prev_result
        self.options = {"can_catch_error": False}

        if ext_options is not None:
            self.options.update(ext_options)

    @abstractmethod
    def set_http_status(self, status: int) -> None:
        """
        Gán giá trị http status code.

        Args:
            status: Mã http status code hợp lệ.
        """
        pass

    @abstractmethod
    def get_body(self) -> Any:
        """
        Lấy body trong HTTP Request (Payload), nếu request có body.

        Returns:
            Body data từ HTTP request
        """
        pass

    @abstractmethod
    def get_temp_data(self, key: str) -> Any:
        """
        Lấy dữ liệu tạm thời đã được lưu trong context với key.

        Args:
            key: key của dữ liệu đã lưu.

        Returns:
            Dữ liệu đã lưu với key tương ứng
        """
        pass

    @abstractmethod
    def get_query(self) -> Any:
        """
        Lấy phần query trong URL.

        Returns:
            Query parameters từ URL
        """
        pass

    @abstractmethod
    def get_params(self) -> Any:
        """
        Lấy các tham số ở trong phần pathname của URL.

        Returns:
            Path parameters từ URL
        """
        pass

    @abstractmethod
    def get_headers(self) -> Any:
        """
        Lấy Request Headers.

        Returns:
            Headers từ HTTP request
        """
        pass

    @abstractmethod
    def set_body(self, body: Union[Callable[[Any], Any], Any]) -> None:
        """
        Thiết lập giá trị mới cho body, hoặc là update.

        Args:
            body: body mới hoặc một phần body mới, có thể là function để update
        """
        pass

    @abstractmethod
    def add_temp_data(self, key: str, data: Any) -> None:
        """
        Thêm dữ liệu tạm thời vào trong context với key.

        Args:
            key: key của dữ liệu.
            data: dữ liệu cần lưu.
        """
        pass

    @abstractmethod
    def send_streaming(
        self,
        source: Union[IO[bytes], bytes, BytesIO],
        content_type: Optional[str] = None,
    ) -> Any:
        """
        Gửi lại Client bên ngoài runtime (requester) một Streaming Response.

        Args:
            source: dữ liệu truyền về là một dạng stream hoặc bytes.
            content_type: kiểu content trả về, phải phù hợp với stream.
        """
        pass

    @abstractmethod
    def send_json(self, data: Any, meta: Optional[Any] = None) -> Any:
        """
        Gửi lại Client bên ngoài runtime (requester) một JSON Response.

        Args:
            data: dữ liệu trả về (kết quả).
            meta: các thông tin thêm trong quá trình thực hiện hoặc là của chính kết quả.
        """
        pass

    @abstractmethod
    def send_html(self, html_str: str) -> Any:
        """
        Gửi lại Client bên ngoài runtime (requester) một HTML Response.

        Args:
            html_str: một chuỗi trả về theo chuẩn HTML.
        """
        pass

    @abstractmethod
    def send_error(self, error: Any) -> Any:
        """
        Gửi lại Client bên ngoài runtime (requester) một Error Response theo chuẩn JSON.

        Args:
            error: lỗi phản hồi, có thể là `ClientError` hoặc `AppError`.
        """
        pass

    @abstractmethod
    def next(self, p: Any) -> Any:
        """
        Hàm next trong một số runtime.
        Mặc định trả về None, các subclass có thể override nếu cần.
        """
        pass
