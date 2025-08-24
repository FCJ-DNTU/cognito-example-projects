from typing import Any, Callable, List

from core.error.ClientError import ClientError
from core.context.pipeline.main import Pipeline
from core.context.runtime_context.RuntimeContext import RuntimeContext
from helpers.get_info_from_claims import get_info_from_claims


def create_teams_check_step_executor(
    pipeline: Pipeline, allowed_teams: List[str]
) -> Callable[[RuntimeContext], Any]:
    """
    Tạo một Step Executor mới để kiểm tra team người dùng.

    Args:
        pipeline: pipeline.
        allowed_teams: các vai trò được phép thực hiện.
    Returns:
        hàm step executor.
    """

    def step_executor(ctx: RuntimeContext):
        if allowed_teams and allowed_teams[0] == "*":
            return

        claims = ctx.get_temp_data("claims")
        user = get_info_from_claims(claims)

        if user.get("team") not in allowed_teams:
            pipeline.stop(ctx)

            err = ClientError("You don't have permission to do this action")
            err.as_http_error("Forbidden")
            err.add_error_detail(
                {
                    "source": "teamCheck",
                    "desc": f"Team of user is not allowed: {user.get('team')}",
                }
            )
            return ctx.send_json(err)

    return step_executor
