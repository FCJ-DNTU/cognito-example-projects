/**
 * Hàm này sẽ dùng để tổng hợp thông tin và tạo claims của user
 * và bỏ vào trong token trước khi tạo token. Hoạt động với cả
 * khi sign in và refresh tokens.
 *
 * @param event - lambda event
 * @param context - lambda context
 *
 * @returns
 */
export async function handler(event: any, context: any) {
  // Lấy thông tin từ userAttributes
  const userAttrs = event.request.userAttributes;

  const role = userAttrs["custom:role"] || "";
  const fullName = userAttrs["name"];

  // Gán lại response với claims và scopes
  event.response = {
    claimsAndScopeOverrideDetails: {
      idTokenGeneration: {
        claimsToAddOrOverride: {
          "custom:role": role,
          full_name: fullName,
        },
      },
      accessTokenGeneration: {
        claimsToAddOrOverride: {
          "custom:role": role,
        },
        scopesToAdd: role ? [`role:${role}`] : [],
      },
    },
  };

  return event;
}
