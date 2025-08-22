import os

# Import external packages
from dotenv import load_dotenv

# Tải biến môi trường từ file .env
load_dotenv()


class Configs:
    Aws_Profile = os.getenv("AWS_PROFILE", "default")
    Aws_Access_Key_Id = os.getenv("AWS_ACCESS_KEY_ID", "")
    Aws_Secret_Access_Key = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    Aws_Region = os.getenv("AWS_REGION", "ap-southeast-1")
    DynamoDB_Table_Name_PCustomers = os.getenv(
        "DYNAMODB_TABLE_NAME_PCUSTOMERS", "test_table"
    )
    Cognito_User_Pool_Id = os.getenv("COGNITO_USER_POOL_ID", "")
    Cognito_App_Client_Id = os.getenv("COGNITO_APP_CLIENT_ID", "")
    Cognito_App_Client_Secret = os.getenv("COGNITO_APP_CLIENT_SECRET", "")
