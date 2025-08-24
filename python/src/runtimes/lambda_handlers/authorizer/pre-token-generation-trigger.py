def handler(event, context):
    """
    Hàm này sẽ dùng để tổng hợp thông tin và tạo claims của user
    và bỏ vào trong token trước khi tạo token. Hoạt động với cả
    khi sign in và refresh tokens.

    :param event: lambda event
    :param context: lambda context
    :return: event với response được gán thêm claims
    """

    # Lấy thông tin từ userAttributes
    user_attrs = event["request"]["userAttributes"]

    role = user_attrs.get("custom:role", "")
    full_name = user_attrs.get("name", "")

    # Gán lại response với claims và scopes
    event["response"] = {
        "claimsAndScopeOverrideDetails": {
            "idTokenGeneration": {
                "claimsToAddOrOverride": {
                    "custom:role": role,
                    "full_name": full_name,
                },
            },
            "accessTokenGeneration": {
                "claimsToAddOrOverride": {
                    "custom:role": role,
                },
                "scopesToAdd": [f"role:{role}"] if role else [],
            },
        },
    }

    return event
