# Import built-in packages
import sys
import os
import pathlib

# Import the ./packages to sys path, because we need python recognize
# all of packages inside ./packages
ROOT_DIR = pathlib.Path(__file__).resolve().parents[3]
BASE_DIR = os.path.abspath(
    os.path.join(os.path.join(os.path.dirname(__file__)), "..", "..")
)

sys.path.insert(0, BASE_DIR)
sys.path.append(str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import from core
from core.docs.swagger.main import create_custom_openapi_schema

# Import from utils
from utils.constants.app import APP_CONSTANTS

# Import routes
from runtimes.fastapi.routes.auth.main import router as auth_router
from runtimes.fastapi.routes.pcustomer_management.main import router as pcustomer_router

app = FastAPI()
app.openapi = lambda: create_custom_openapi_schema(app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def handle_root():
    return JSONResponse(
        content={"data": {"message": "Welcome to Cognito Example Application API"}},
        status_code=200,
    )


app.include_router(auth_router)
app.include_router(pcustomer_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.runtimes.fastapi.app:app",
        host=APP_CONSTANTS.get("HOST", ""),
        port=APP_CONSTANTS.get("PORT", ""),
        reload=(
            True
            if APP_CONSTANTS.get("ENVIRONMENT", "development") == "development"
            else False
        ),
        log_level="info",
    )
