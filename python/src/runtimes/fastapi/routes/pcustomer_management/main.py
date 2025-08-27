from typing import Annotated, List, Dict

from fastapi import APIRouter, Request, Response, Body, Query, Path

# Import pipelines
from core.modules.pcustomer_management.ports.main import (
    get_customer_pipeline,
    get_customers_pipeline,
    add_customer_pipeline,
    update_customer_pipeline,
    delete_customer_pipeline,
)

# Import schema
from core.docs.swagger.helpers import StandardJsonResponse
from core.modules.pcustomer_management.data_model.schema import (
    PCustomerSchema,
    GetPCustomersResultMetaSchema,
    CreatePCustomerSchema,
    CreatePCustomerDescriptiveObject,
    UpdatePCustomerSchema,
    UpdatePCustomerDescriptiveObject,
)

# Import from runtimes
from runtimes.fastapi.adapters.context import FastAPIRuntimeContext

router = APIRouter()
route_tag = "Potential Customers"


@router.get(
    "/pcustomers",
    tags=[route_tag],
    response_model=StandardJsonResponse[
        List[PCustomerSchema], GetPCustomersResultMetaSchema
    ],
)
async def handle_get_pcustomers(
    req: Request,
    res: Response,
    limit: Annotated[str, Query(examples=["10"])] = "",
    startKey: Annotated[str, Query(examples=["base64_string"])] = "",
):
    ctx = FastAPIRuntimeContext(req, res)
    return await get_customers_pipeline.run(ctx)


@router.get(
    "/pcustomers/{id}",
    tags=[route_tag],
    response_model=StandardJsonResponse[PCustomerSchema, Dict],
)
async def handle_get_pcustomer(
    req: Request,
    res: Response,
    id: Annotated[str, Path(examples=["CUSTOMER#___"])],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await get_customer_pipeline.run(ctx)


@router.post(
    "/pcustomer",
    tags=[route_tag],
    response_model=StandardJsonResponse[PCustomerSchema, Dict],
)
async def handle_add_pcustomer(
    req: Request,
    res: Response,
    _: Annotated[Dict, Body(examples=[CreatePCustomerDescriptiveObject])],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await add_customer_pipeline.run(ctx)


@router.patch(
    "/pcustomers/{id}",
    tags=[route_tag],
    response_model=StandardJsonResponse[PCustomerSchema, Dict],
)
async def handle_update_pcustomer(
    req: Request,
    res: Response,
    id: Annotated[str, Path(examples=["CUSTOMER#___"])],
    _: Annotated[Dict, Body(examples=[UpdatePCustomerDescriptiveObject])],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await update_customer_pipeline.run(ctx)


@router.delete(
    "/pcustomers/{id}",
    tags=[route_tag],
    response_model=StandardJsonResponse[bool, Dict],
)
async def handle_delete_pcustomer(
    req: Request,
    res: Response,
    id: Annotated[str, Path(examples=["CUSTOMER#___"])],
):
    ctx = FastAPIRuntimeContext(req, res)
    return await delete_customer_pipeline.run(ctx)
