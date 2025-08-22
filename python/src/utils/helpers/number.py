from typing import Any


def is_actual_number(value: Any) -> bool:
    """
    Kiểm tra xem một giá trị có thật sự là số (int hoặc float) trong Python.

    Args:
        value: Giá trị cần kiểm tra.

    Returns:
        True nếu là số thực sự (int hoặc float) và không phải NaN, ngược lại False.
    """
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and not value != value
    )  # NaN check


def is_number(value: Any) -> bool:
    """
    Kiểm tra xem một giá trị có thể được chuyển đổi thành số hay không.

    Args:
        value: Giá trị cần kiểm tra (có thể là chuỗi, số, v.v.).

    Returns:
        True nếu giá trị có thể chuyển thành số (int hoặc float), ngược lại False.
    """
    try:
        # Trường hợp đặc biệt: NaN
        if value != value:
            return False

        int_val = int(value)
        float_val = float(value)

        return True
    except (ValueError, TypeError):
        return False
