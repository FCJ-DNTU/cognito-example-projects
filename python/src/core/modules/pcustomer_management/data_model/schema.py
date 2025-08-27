from pydantic import BaseModel, Field
from typing import Optional

# Import constants
from utils.constants.regex import (
    CUSTOMER_ID_PREFIX_PATTERN,
    ISO8601_DATETIME_PATTERN,
    VIETNAMESE_NAME_PATTERN,
    VIETNAMESE_PHONENUMBER_PATTERN,
    SNAKECASE_PATTERN,
)

id_schema = Field(
    ...,
    description="Customer ID, must match prefix format",
    pattern=CUSTOMER_ID_PREFIX_PATTERN,
)
full_name_schema = Field(
    ..., description="Vietnamese full name", pattern=VIETNAMESE_NAME_PATTERN
)
phone_schema = Field(
    ..., description="Vietnamese phone number", pattern=VIETNAMESE_PHONENUMBER_PATTERN
)
age_schema = Field(..., ge=18, le=90, description="Age between 18 and 90")
product_code_schema = Field(
    ..., description="Product code in snake_case format", pattern=SNAKECASE_PATTERN
)
create_at_schema = Field(
    ..., description="ISO 8601 datetime string", pattern=ISO8601_DATETIME_PATTERN
)


class PCustomerSchema(BaseModel):
    id: str
    fullName: str
    phone: str
    age: int
    type: str
    productCode: str
    createAt: str


class GetPCustomersResultMetaSchema(BaseModel):
    limit: str
    lastKey: str


class CreatePCustomerSchema(BaseModel):
    fullName: str = full_name_schema
    phone: str = phone_schema
    age: int = age_schema
    productCode: str = product_code_schema


class UpdatePCustomerSchema(BaseModel):
    fullName: Optional[str] = full_name_schema
    phone: Optional[str] = phone_schema
    age: Optional[int] = age_schema
    productCode: Optional[str] = product_code_schema


CreatePCustomerDescriptiveObject = CreatePCustomerSchema(
    fullName="Nguyen Anh Tuan", phone="0912345678", age=30, productCode="household_tool"
).model_dump()

UpdatePCustomerDescriptiveObject = UpdatePCustomerSchema(
    fullName="Trần Văn Anh", phone="0987654321", age=28, productCode="book"
).model_dump()
