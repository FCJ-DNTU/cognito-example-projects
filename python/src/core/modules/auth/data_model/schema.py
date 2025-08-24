from pydantic import BaseModel, Field


class SignInDataSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9]+$")
    password: str = Field(
        ..., min_length=8, max_length=128, pattern=r"^[a-zA-Z0-9!@#$%^&*()_+=-]+$"
    )


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
