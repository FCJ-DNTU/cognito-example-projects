import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

// Import constants
import { Configs } from "../../../../utils/configs";

// Import errors
import { AppError, isStandardError } from "../../../error";

// Import aws clients from utils
import { getCognitoIDProviderClient } from "../../../../utils/aws-clients";

// Import types
import type { InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Cho phép một người dùng đăng nhập vào trong hệ thống.
 *
 * @param ctx - runtime context
 *
 * @returns
 */
export async function signIn(ctx: TRuntimeContext) {
  try {
    const body = await ctx.getBody<{ username: string; password: string }>();

    const input: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        PASSWORD: body.password,
        USERNAME: body.username,
      },
      ClientId: Configs.CognitoAppClientId,
    };

    const client = getCognitoIDProviderClient({});
    const command = new InitiateAuthCommand(input);
    const response = await client.send(command);

    const authenticationResult = response.AuthenticationResult!;

    return {
      auth: {
        idToken: authenticationResult.IdToken,
        accessToken: authenticationResult.AccessToken,
        refreshToken: authenticationResult.RefreshToken,
        expiresIn: authenticationResult.ExpiresIn,
      },
    };
  } catch (error: any) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot authenticate user");
    err.asHTTPError("InternalServerError");
    err.addErrorDetail({ source: "signIn", desc: error.message });
    return err;
  }
}
