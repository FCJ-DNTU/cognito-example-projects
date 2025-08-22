import boto3

# Import from utils
from utils.configs import Configs


def get_client(
    service_name: str,
    profile_name: str = Configs.Aws_Profile,
    region_name: str = Configs.Aws_Region,
):
    """Hàm nền tảng dùng để tạo bất kì client cho bất kì dịch vụ nào đó.

    Args:
        service_name (str): tên dịch vụ.
        profile_name (str): tên của profile.
        region_name (str): tên của region.

    Returns:
        _: client của service.
    """
    # Create a session using the named profile 'vsl'
    session = boto3.Session(profile_name=profile_name)

    # Create a Service client from the session
    client = session.client(
        service_name=service_name, region_name=region_name
    )  # adjust region as needed
    return client


def get_dynamodb_client():
    """Cấu hình và lấy DynamoDB Client.

    Returns:
        boto3 DynamoDB client
    """
    return get_client(service_name="dynamodb")


def get_cognito_idp_client():
    """Cấu hình và lấy Cognito Identity Provider Client.

    Returns:
        boto3 Cognito IDP client
    """
    return get_client(service_name="cognito-idp")
