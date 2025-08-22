def is_empty(value) -> bool:
    """
    Kiểm tra xem một chuỗi có rỗng hay không.

    Tham số:
        value: giá trị muốn kiểm tra.

    Trả về:
        True nếu là chuỗi rỗng sau khi trim, False nếu không phải chuỗi hoặc không rỗng.
    """
    if not isinstance(value, str):
        return False
    return value.strip() == ""
