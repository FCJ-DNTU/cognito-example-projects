from typing import Any, Callable, List

from core.error.ClientError import ClientError
from core.context.pipeline.main import Pipeline
from core.context.runtime_context.RuntimeContext import RuntimeContext
from core.modules.auth.helpers import get_info_from_claims


def create_roles_check_step_executor(
    pipeline: Pipeline, allowed_roles: List[str]
) -> Callable[[RuntimeContext], Any]:
    """
    Tạo một Step Executor mới để kiểm tra role người dùng.

    Args:
        pipeline: pipeline.
        allowed_roles: các vai trò được phép thực hiện.
    Returns:
        hàm step executor.
    """

    def step_executor(ctx: RuntimeContext):
        if allowed_roles and allowed_roles[0] == "*":
            return

        claims = ctx.get_temp_data("claims")
        user = get_info_from_claims(claims)

        if user.get("role") not in allowed_roles:
            pipeline.stop(ctx)

            err = ClientError("You don't have permission to do this action")
            err.as_http_error("Forbidden")
            err.add_error_detail(
                {
                    "source": "roleCheck",
                    "desc": f"Role of user is not allowed: {user.get('role')}",
                }
            )
            return ctx.send_json(err)

    return step_executor
