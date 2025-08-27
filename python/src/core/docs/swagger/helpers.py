from typing import Dict, List, Any, Generic, TypeVar

from pydantic import BaseModel

TData = TypeVar("TData")
TMeta = TypeVar("TMeta")


class StandardJsonResponse(BaseModel, Generic[TData, TMeta]):
    """
    Định nghĩa cấu trúc phản hồi JSON chuẩn dùng chung cho toàn hệ thống.

    Đây là một lớp generic cho phép tùy biến kiểu dữ liệu trả về (`data`) và thông tin phụ (`meta`),
    đồng thời cung cấp trường `error` để mô tả lỗi nếu có.

    Generic:
        TData: Kiểu dữ liệu chính được trả về trong response (ví dụ: dict, list, schema cụ thể).
        TMeta: Kiểu dữ liệu phụ cho metadata (ví dụ: thông tin phân trang, mã lỗi, trạng thái).

    Attributes:
        error (Dict[str, Any]): Thông tin lỗi nếu có, bao gồm mã lỗi, mô tả, hoặc chi tiết kỹ thuật.
        data (TData | Any): Dữ liệu chính của phản hồi. Có thể là bất kỳ kiểu nào tùy theo ngữ cảnh sử dụng.
        meta (TMeta | Dict[str, Any]): Metadata bổ sung cho phản hồi, ví dụ: trạng thái, phân trang, mã xử lý.
    """

    data: TData | List[Any] | Dict[str, Any]
    meta: TMeta | Dict[str, Any]
