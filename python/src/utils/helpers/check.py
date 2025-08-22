from typing import Any

from core.error import AppError

# Import other helpers
from .string import is_empty


def check_empty_or_throw_error(value: Any, value_name: str, msg: str | None = None):
    """
    Kiểm tra và có thể ném lỗi nếu như chuỗi là rỗng.

    Args:
        value: giá trị cần kiểm tra.
        value_name: tên của giá trị.
        msg: thông báo lỗi tuỳ chỉnh.

    Returns:
        None
    """
    if not msg:
        msg = f"{value_name} is empty"

    if is_empty(value):
        raise AppError(msg)


def check_undefined_or_throw_error(value: Any, value_name: str, msg: str | None = None):
    """
    Kiểm tra và có thể ném lỗi nếu như giá trị là undefined.

    Args:
        value: giá trị cần kiểm tra.
        value_name: tên của giá trị.
        msg: thông báo lỗi tuỳ chỉnh.

    Returns:
        None
    """
    if not msg:
        msg = f"{value_name} is undefined"

    if value is None and value_name not in locals():
        raise AppError(msg)


def check_null_or_throw_error(value: Any, value_name: str, msg: str | None = None):
    """
    Kiểm tra và có thể ném lỗi nếu như giá trị là null.

    Args:
        value: giá trị cần kiểm tra.
        value_name: tên của giá trị.
        msg: thông báo lỗi tuỳ chỉnh.

    Returns:
        None
    """
    if not msg:
        msg = f"{value_name} is undefined"

    if value is None:
        raise AppError(msg)


def check_existance_or_throw_error(value: Any, value_name: str, msg: str | None = None):
    """
    Kiểm tra và có thể ném lỗi nếu như giá trị không tồn tại.

    Args:
        value: giá trị cần kiểm tra.
        value_name: tên của giá trị.
        msg: thông báo lỗi tuỳ chỉnh.

    Returns:
        None
    """
    check_undefined_or_throw_error(value, value_name, msg)
    check_null_or_throw_error(value, value_name, msg)


def check_prop_in_obj_or_throw_error(
    obj: Any, obj_name: str, prop_name: str, msg: str | None = None
):
    """
    Kiểm tra và có thể ném lỗi nếu như một prop không tồn tại trong obj.

    Args:
        obj: object cần kiểm tra.
        obj_name: tên của object.
        prop_name: tên của prop cần kiểm tra.
        msg: thông báo lỗi tuỳ chỉnh.

    Returns:
        None
    """
    if not msg:
        msg = f"{prop_name} must be in {obj_name}"

    if prop_name not in obj or not obj.get(prop_name):
        raise AppError(msg)
