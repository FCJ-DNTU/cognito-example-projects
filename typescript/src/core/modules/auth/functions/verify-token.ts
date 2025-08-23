import jwt from "jsonwebtoken";
import jose from "node-jose";

// Import constants
import { Configs } from "../../../../utils/configs/index.js";

// Import errors
import { AppError, ClientError, isStandardError } from "../../../error";

import { initializeInternalContext } from "../../../context/internal-context/index.js";

// Import helpers
import { getAuthorizationToken } from "../helpers/get-authorization-token.js";
import { getPublicKeys } from "../helpers/get-public-keys.js";

// Import types
import type { JwtPayload } from "jsonwebtoken";
import type { TRuntimeContext } from "../../../context/runtime-context/type.js";
import type { Pipeline } from "../../../context/pipeline/index.js";

const { JWK } = jose;

const appClientId = Configs.CognitoAppClientId;

/**
 * Xác thực token xem có hợp lệ hay không?
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function verifyToken(ctx: TRuntimeContext) {
  try {
    // Setup context before go further
    const internalCtx = initializeInternalContext();
    (internalCtx.params as any).headers = await ctx.getHeaders();
    internalCtx.options!.canCatchError = true;

    const token = getAuthorizationToken(internalCtx)!;
    const decodedHeader = jwt.decode(token, { complete: true });

    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error("Invalid token header");
    }

    const keys = await getPublicKeys();

    if (isStandardError(keys)) {
      return keys;
    }

    const key = keys.find((key: any) => key.kid === decodedHeader.header.kid);

    if (!key) {
      const err = new AppError("Token is invalid");
      err.addErrorDetail({
        source: "verifyToken",
        desc: "Public key not found",
      });
      err.asHTTPError("InternalServerError");
      return err;
    }

    const jwkKey = await JWK.asKey({
      kty: key.kty,
      n: key.n,
      e: key.e,
    });

    const publicKey = jwkKey.toPEM();
    const claims = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    // Post check claims
    if (Date.now() / 1000 > claims.exp!) {
      const err = new ClientError("Token is invalid");
      err.addErrorDetail({
        source: "verifyToken",
        desc: "Token is expired",
      });
      err.asHTTPError("Unauthorized");
      return err;
    }

    if (claims.client_id !== appClientId) {
      const err = new ClientError("Token is invalid");
      err.addErrorDetail({
        source: "verifyToken",
        desc: "Token was not issued for this audience",
      });
      err.asHTTPError("Unauthorized");
      return err;
    }

    return claims;
  } catch (error: any) {
    if (isStandardError(error)) return error;

    const err = new AppError("Verify token failed");
    err.asHTTPError("InternalServerError");
    err.addErrorDetail({ source: "verifyToken", desc: error.message });
    return err;
  }
}

/**
 * Tạo ra một step executor có gán pipeline trong đó để xác thực token.
 *
 * @param pipeline - pipeline
 *
 * @returns
 */
export function createVerifyTokenStepExecutor(pipeline: Pipeline<any>) {
  return async function (ctx: TRuntimeContext) {
    const result = await verifyToken(ctx);

    if (isStandardError(result)) {
      // Stop pipeline
      pipeline.stop(ctx);

      return ctx.sendError(result);
    }

    // Save claims as temp data
    ctx.addTempData("claims", result);

    return result;
  };
}
