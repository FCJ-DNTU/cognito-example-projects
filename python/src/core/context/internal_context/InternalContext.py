from typing import Dict, Any, Optional
from dataclasses import dataclass, field

from core.context.runtime_context.RuntimeContext import RuntimeContext


@dataclass
class InternalContext:
    """
    Ở trong core thì cũng có context của riêng nó, gọi là Internal Context.
    """

    params: Dict[str, Any] = {}
    """Tham số chính của hàm/module."""

    prev_result: Optional[Any] = None
    """Kết quả của lần thực thi trước nếu đang ở trong pipeline."""

    runtime_ctx: Optional[RuntimeContext] = None
    """Context từ runtime."""

    options: Dict[str, Any] = field(default_factory={"can_catch_error": False})
    """Một số các tham số thêm cho hàm/module để xử lý."""
