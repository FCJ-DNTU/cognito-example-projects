from pydantic import BaseModel, Field


class SignInData(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9]+$")
    password: str = Field(
        ..., min_length=8, max_length=128, pattern=r"^[a-zA-Z0-9!@#$%^&*()_+=-]+$"
    )


class RefreshTokensData(BaseModel):
    refreshToken: str = Field(..., min_length=10)


class AuthTokens(BaseModel):
    idToken: str
    accessToken: str
    refreshToken: str
    expiresIn: int


class SignInResult(BaseModel):
    auth: AuthTokens


class RefreshTokensResult(BaseModel):
    auth: AuthTokens
