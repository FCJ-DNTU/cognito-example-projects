import os
from dotenv import load_dotenv

load_dotenv()

APP_CONSTANTS = {
    "HOST": os.getenv("HOST", "localhost"),
    "PORT": int(os.getenv("PORT", "7800")),
}
