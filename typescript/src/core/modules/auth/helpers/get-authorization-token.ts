// Import errors
import { ClientError } from "../../../error";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Lấy token từ trong headers. Mặc định sẽ lấy Bearer token.
 *
 * @param ctx - runtime context
 *
 * @returns
 */
export async function getAuthorizationToken(
  ctx: TRuntimeContext,
): Promise<string> {
  const headers = await ctx.getHeaders<any>();

  const authHeader =
    headers.Authorization ||
    headers.authorization || // fallback lowercase nếu dùng HTTP API
    null;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new ClientError("Missing or invalid Authorization header");
    err.asHTTPError("BadRequest");
    throw err;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    const err = new ClientError("Bearer token not found");
    err.asHTTPError("BadRequest");
    throw err;
  }

  return token;
}
