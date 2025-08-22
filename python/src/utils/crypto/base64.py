import base64
import json
from typing import Any


def encode(data: Any) -> str:
    """
    Mã hóa dữ liệu Python thành chuỗi Base64.

    Hàm này tuần tự hóa dữ liệu Python (dict, list, tuple, str, int, float, bool, None)
    thành JSON, sau đó mã hóa thành Base64.

    - Tuple được giữ nguyên bằng cách sử dụng đánh dấu đặc biệt {"__tuple__": True, "items": [...]}
    - Hoạt động với mọi dữ liệu có thể tuần tự hóa bằng JSON.

    Tham số:
        data (Any): Đối tượng Python cần mã hóa.

    Trả về:
        str: Chuỗi đã mã hóa Base64.
    """
    if isinstance(data, tuple):
        data = {"__tuple__": True, "items": list(data)}
    json_str = json.dumps(data)
    return base64.b64encode(json_str.encode()).decode()


def decode(encoded: str) -> Any:
    """
    Giải mã chuỗi Base64 về dữ liệu Python.

    Hàm này giải mã chuỗi Base64 thành JSON và khôi phục tuple
    nếu phát hiện đánh dấu đặc biệt {"__tuple__": True, "items": [...]}.

    Tham số:
        encoded (str): Chuỗi đã mã hóa Base64.

    Trả về:
        Any: Đối tượng Python đã giải mã.
    """
    json_str = base64.b64decode(encoded.encode()).decode()
    data = json.loads(json_str)
    if isinstance(data, dict) and data.get("__tuple__") is True:
        return tuple(data["items"])
    return data


def url_safe_encode(data: Any) -> str:
    """
    Mã hóa dữ liệu Python thành chuỗi Base64 an toàn với URL.

    Giống như encode(), nhưng sử dụng mã hóa Base64 an toàn với URL
    để tránh các ký tự như '+' và '/' vốn cần được mã hóa khi dùng trong URL.

    Tham số:
        data (Any): Đối tượng Python cần mã hóa.

    Trả về:
        str: Chuỗi Base64 an toàn với URL.
    """
    if isinstance(data, tuple):
        data = {"__tuple__": True, "items": list(data)}
    json_str = json.dumps(data)
    return base64.urlsafe_b64encode(json_str.encode()).decode()


def url_safe_decode(encoded: str) -> Any:
    """
    Giải mã chuỗi Base64 an toàn với URL về dữ liệu Python.

    Giống như decode(), nhưng áp dụng cho chuỗi Base64 an toàn với URL.

    Tham số:
        encoded (str): Chuỗi Base64 an toàn với URL.

    Trả về:
        Any: Đối tượng Python đã giải mã.
    """
    json_str = base64.urlsafe_b64decode(encoded.encode()).decode()
    data = json.loads(json_str)
    if isinstance(data, dict) and data.get("__tuple__") is True:
        return tuple(data["items"])
    return data
