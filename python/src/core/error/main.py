from .ClientError import ClientError
from .AppError import AppError


def is_standard_error(err):
    """Kiểm tra xem nếu một lỗi có phải là lỗi tiêu chuẩn (AppError, ClientError).

    Args:
        err: lỗi cần kiểm tra.

    Returns:
        bool: `True` nếu như là chuẩn lỗi, `False` nếu như không phải
    """
    return isinstance(err, ClientError) or isinstance(err, AppError)
