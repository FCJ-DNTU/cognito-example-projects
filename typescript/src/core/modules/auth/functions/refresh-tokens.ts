import { GetTokensFromRefreshTokenCommand } from "@aws-sdk/client-cognito-identity-provider";

// Import constants
import { Configs } from "../../../../utils/configs";

// Import errors
import { AppError, isStandardError } from "../../../error";

// Import aws clients from utils
import { getCognitoIDProviderClient } from "../../../../utils/aws-clients";

// Import types
import type { GetTokensFromRefreshTokenCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Cho phép người dùng có thể làm mới lại các tokens.
 *
 * @param ctx - runtime context
 *
 * @returns
 */
export async function refreshTokens(ctx: TRuntimeContext) {
  try {
    const body = await ctx.getBody<{ refreshToken: string }>();

    const input: GetTokensFromRefreshTokenCommandInput = {
      RefreshToken: body.refreshToken,
      ClientId: Configs.CognitoAppClientId,
    };

    const client = getCognitoIDProviderClient({});
    const command = new GetTokensFromRefreshTokenCommand(input);
    const response = await client.send(command);

    const authenticationResult = response.AuthenticationResult!;

    return {
      auth: {
        idToken: authenticationResult.IdToken,
        accessToken: authenticationResult.AccessToken,
        expiresIn: authenticationResult.ExpiresIn,
      },
    };
  } catch (error: any) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot refresh tokens");
    err.asHTTPError("InternalServerError");
    err.addErrorDetail({ source: "refreshToken", desc: error.message });
    return err;
  }
}
