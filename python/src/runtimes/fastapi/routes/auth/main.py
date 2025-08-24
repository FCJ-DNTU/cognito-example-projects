from typing import Annotated

from fastapi import APIRouter, Request, Response, Body

# Import pipelines
from core.modules.auth.ports.main import sign_in_pipeline, refresh_tokens_pipeline

# Import schema
from core.modules.auth.data_model.schema import (
    SignInDataDecriptiveObject,
    SignInResultSchema,
    RefreshTokensDescriptiveObject,
    RefreshTokensResulSchema,
)

# Import from runtimes
from runtimes.fastapi.adapters.context import FastAPIRuntimeContext

router = APIRouter()
route_tag = "Auth"


@router.post("/auth/sign-in", tags=[route_tag], response_model=SignInResultSchema)
async def handle_sign_in_tokens(
    req: Request,
    res: Response,
    _: Annotated[dict, Body(example=SignInDataDecriptiveObject)],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await sign_in_pipeline.run(ctx)


@router.post(
    "/auth/refresh-tokens", tags=[route_tag], response_model=RefreshTokensResulSchema
)
async def handle_refresh_tokens(
    req: Request,
    res: Response,
    _: Annotated[dict, Body(example=RefreshTokensDescriptiveObject)],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await refresh_tokens_pipeline.run(ctx)
