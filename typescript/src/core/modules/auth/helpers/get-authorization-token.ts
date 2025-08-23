// Import errors
import { AppError, ClientError, isStandardError } from "../../../error";

// Import types
import type { TInternalContext } from "../../../context/internal-context";

/**
 * Lấy token từ trong headers. Mặc định sẽ lấy Bearer token.
 *
 * @param ctx - runtime context
 *
 * @returns
 */
export function getAuthorizationToken(
  ctx: TInternalContext,
): string | undefined {
  try {
    const headers = (ctx.params as any).headers;

    const authHeader =
      headers.Authorization ||
      headers.authorization || // fallback lowercase nếu dùng HTTP API
      null;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new ClientError("Missing or invalid Authorization header");
      err.addErrorDetail({ source: "getAuthorizationToken" });
      err.asHTTPError("BadRequest");
      throw err;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const err = new ClientError("Bearer token not found");
      err.addErrorDetail({ source: "getAuthorizationToken" });
      err.asHTTPError("BadRequest");
      throw err;
    }

    return token;
  } catch (error: any) {
    let err = error;

    if (!isStandardError(err)) {
      err = new AppError("Cannot get token from authorization header");
      err.addErrorDetail({
        source: "getAuthorizationToken",
        desc: error.message,
      });
      err.asHTTPError("InternalServerError");
    }

    if (ctx.options && ctx.options.canCatchError) {
      throw err;
    }

    return;
  }
}
