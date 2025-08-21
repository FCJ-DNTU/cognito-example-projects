/**
 * Tổng hợp và lấy thông tin người dùng trong cognito claims.
 *
 * @param claims - cognito claims.
 *
 * @returns
 */
export function getInfoFromClaims(claims: any) {
  return {
    username: claims.username,
    team: claims["cognito:groups"][0],
    role: claims["custom:role"],
  };
}
