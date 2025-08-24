from typing import Generic, List, Dict, Any
from dataclasses import dataclass

from .Step import Step
from .type import TContext, TStepExecutor


@dataclass
class PipelineRunState:
    """State của pipeline khi đang chạy"""

    current_step: int = 0
    can_stop_now: bool = False


class Pipeline(Generic[TContext]):
    """
    Lớp định nghĩa một pipeline.

    Khi các steps được chạy trong một pipeline, thì step sau có
    thể sẽ có được kết quả từ step trước đó. Trong trường hợp này
    thì kết quả đó sẽ được hiểu là params cho step tiếp theo.
    Chính vì thế, khi sử dụng pipeline trong core thì mình phải lưu ý.
    """

    def __init__(self, name: str):
        self.name = name
        self._steps: List[Step[TContext, Any]] = []
        self._run_states: Dict[Any, PipelineRunState] = {}

    def get_steps(self) -> List[Step[TContext, Any]]:
        """
        Trả về các steps trong một pipeline.

        Returns:
            List các steps
        """
        return self._steps

    def add_step(self, executor: TStepExecutor[TContext, Any]) -> "Pipeline[TContext]":
        """
        Thêm một step mới vào trong pipeline.

        Args:
            executor: executor của step.

        Returns:
            Self để chain methods
        """
        new_step = Step[TContext, Any](executor)
        self._steps.append(new_step)
        return self

    def stop(self, ctx: TContext) -> None:
        """
        Cho phép dừng pipeline sau sau một step, mà step này gọi stop().

        Args:
            ctx: Context hiện tại
        """
        curr_state = self._run_states.get(id(ctx))
        if not curr_state:
            return
        curr_state.can_stop_now = True

    async def run(self, ctx: TContext) -> Any:
        """
        Chạy pipeline theo context được truyền vào.

        Args:
            ctx: Context để chạy pipeline

        Returns:
            Kết quả của step cuối cùng
        """
        current_result: Any = None
        ctx_id = id(ctx)
        self._run_states[ctx_id] = PipelineRunState(current_step=0, can_stop_now=False)

        for step in self._steps:
            maybe_promise = step.execute(ctx)

            # Xử lý coroutine
            if hasattr(maybe_promise, "__await__"):
                current_result = await maybe_promise
            else:
                current_result = maybe_promise

            # Set prev result vào context
            if hasattr(ctx, "prev_result"):
                ctx.prev_result = current_result
            else:
                # Fallback nếu context không có prev_result attribute
                setattr(ctx, "prev_result", current_result)

            # Process post step execution
            if self._run_states[ctx_id].can_stop_now:
                break

            # Update state
            self._run_states[ctx_id].current_step += 1

        # Clear state
        del self._run_states[ctx_id]

        return current_result
