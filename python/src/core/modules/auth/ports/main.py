from core.context.pipeline import Pipeline

# Import error
from core.error import is_standard_error

# Import functions
from core.modules.auth.functions import (
    sign_in,
    refresh_tokens,
)

# Import schema & validators
from core.validation.pydantic.helpers import create_validation_step_executor
from core.modules.auth.data_model.schema import (
    SignInDataSchema,
    RefreshTokensDataSchema,
)

sign_in_pipeline = Pipeline("Sign In Pipeline")
refresh_tokens_pipeline = Pipeline("Refresh Tokens Pipeline")

sign_in_pipeline.add_step(
    create_validation_step_executor(sign_in_pipeline, SignInDataSchema)
).add_step(sign_in).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)

refresh_tokens_pipeline.add_step(
    create_validation_step_executor(refresh_tokens_pipeline, RefreshTokensDataSchema)
).add_step(refresh_tokens).add_step(
    lambda ctx: (
        ctx.send_error(ctx.prev_result)
        if is_standard_error(ctx.prev_result)
        else ctx.send_json(ctx.prev_result)
    )
)
