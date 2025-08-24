from typing import Generic, Optional, TypeVar, Awaitable, Union, Callable

TContext = TypeVar("TContext")
TResult = TypeVar("TResult")
TStepExecutor = Callable[[TContext], Union[TResult, Awaitable[TResult]]]
