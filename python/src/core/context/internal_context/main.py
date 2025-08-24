from .InternalContext import InternalContext


def initialize_internal_context():
    """
    Tạo một InternalContext rỗng, có thể setup sau

    Returns:
        InternalContext rỗng với params = None
    """
    return InternalContext()
