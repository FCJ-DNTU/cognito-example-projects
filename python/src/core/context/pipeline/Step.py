from typing import Generic, Optional, Awaitable, Union

from .type import TContext, TResult, TStepExecutor


class Step(Generic[TContext, TResult]):
    """
    Lớp định nghĩa bước xử lý trong một pipeline
    """

    def __init__(self, executor: Optional[TStepExecutor[TContext, TResult]] = None):
        self._executor: Optional[TStepExecutor[TContext, TResult]] = None
        if executor:
            self._executor = executor

    def set_executor(self, executor: TStepExecutor[TContext, TResult]) -> None:
        """
        Gán executor cho Step

        Args:
            executor: là một hàm
        """
        self._executor = executor

    def execute(self, ctx: TContext) -> Union[TResult, Awaitable[TResult]]:
        """
        Thực thi executor của một Step

        Args:
            ctx: ngữ cảnh thực thi, có thể là runtime (RuntimeContext)
                 hoặc trong core (InternalContext)
        """
        if not self._executor:
            raise ValueError("Executor of Step is not set")

        return self._executor(ctx)
