// Import errors
import { ClientError } from "../../../error";

// Import helpers
import { getInfoFromClaims } from "../helpers/get-info-from-claims";

// Import types
import type { Pipeline } from "../../../context/pipeline";
import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Tạo một Step Executor mới để kiểm tra team người dùng.
 *
 * @param pipeline - pipeline.
 * @param allowedTeams - các vai trò được phép thực hiện.
 *
 * @returns
 */
export function createTeamsCheckStepExecutor(
  pipeline: Pipeline<any>,
  allowedTeams: Array<string>,
) {
  return async function (ctx: TRuntimeContext) {
    if (allowedTeams[0] === "*") {
      return;
    }

    const claims = await ctx.getTempData("claims");
    const user = getInfoFromClaims(claims);

    if (!allowedTeams.find((team) => user.team === team)) {
      pipeline.stop(ctx);

      const err = new ClientError(
        "You don't have permission to do this action",
      );
      err.asHTTPError("Forbidden");
      err.addErrorDetail({
        source: "teamCheck",
        desc: `Team of user is not allowed: ${user.team}`,
      });
      return ctx.sendJson(err);
    }
  };
}
