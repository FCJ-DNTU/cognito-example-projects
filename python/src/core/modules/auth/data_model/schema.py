from pydantic import BaseModel, Field

# Import constants
from utils.constants import USERNAME_PATTERN, PASSWORD_PATTERN


class SignInDataSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=USERNAME_PATTERN)
    password: str = Field(..., min_length=8, max_length=128, pattern=PASSWORD_PATTERN)


class RefreshTokensDataSchema(BaseModel):
    refreshToken: str = Field(..., min_length=10)


class AuthTokensSchema(BaseModel):
    idToken: str
    accessToken: str
    refreshToken: str
    expiresIn: int


class RefreshTokensSchema(BaseModel):
    idToken: str
    accessToken: str
    expiresIn: int


class SignInResultSchema(BaseModel):
    auth: AuthTokensSchema


class RefreshTokensResulSchema(BaseModel):
    auth: RefreshTokensSchema


SignInDataDecriptiveObject = SignInDataSchema(
    username="myuserName02", password="MyPassword@#123"
).model_dump()

RefreshTokensDescriptiveObject = RefreshTokensDataSchema(
    refreshToken="eqilaksdjlfkjalsdkjclkjasldkfjlaksdjflkajsdlfkjaslkdfj"
).model_dump()
