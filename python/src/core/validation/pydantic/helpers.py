from typing import Callable, Type
from pydantic import BaseModel, ValidationError

# Import errors
from core.error import ClientError


def create_validation_step_executor(
    pipeline, validator_class: Type[BaseModel]
) -> Callable:
    """
    Tạo executor cho bước xác minh dữ liệu trong pipeline.

    Args:
        pipeline: Pipeline mà bạn muốn thêm step vào.
        validator_class: Lớp Pydantic dùng để xác minh dữ liệu.

    Returns:
        Callable thực thi bước xác minh dữ liệu trong pipeline.
    """

    async def executor(ctx):
        body = await ctx.get_body()

        try:
            validated = validator_class(**body)
            return validated
        except ValidationError as e:
            pipeline.stop(ctx)

            err = ClientError("Validation failed")
            err.as_http_error("BadRequest")

            print("Errors:", e.errors())

            for detail in e.errors():
                err.add_error_detail(
                    {
                        "source": ".".join(str(loc) for loc in detail.get("loc", [])),
                        "desc": detail.get("msg"),
                    }
                )

            return ctx.send_error(err)

    return executor
