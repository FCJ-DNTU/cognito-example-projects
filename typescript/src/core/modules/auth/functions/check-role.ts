import { ClientError } from "../../../error";

// Import helpers
import { getInfoFromClaims } from "../helpers/get-info-from-claims";

// Import types
import type { Pipeline } from "../../../context/pipeline";
import type { RuntimeContext } from "../../../context/runtime-context";

/**
 * Tạo một Step Executor mới để kiểm tra role người dùng.
 *
 * @param pipeline - pipeline.
 * @param allowedRoles - các vai trò được phép thực hiện.
 *
 * @returns
 */
export function createRolesCheckStepExecutor(
  pipeline: Pipeline<any>,
  allowedRoles: Array<string>,
) {
  return async function (ctx: RuntimeContext) {
    if (allowedRoles[0] === "*") {
      return;
    }

    const claims = await ctx.getTempData("claims");
    const user = getInfoFromClaims(claims);

    if (!allowedRoles.find((role) => user.role === role)) {
      pipeline.stop(ctx);

      const err = new ClientError(
        "You don't have permission to do this action",
      );
      err.asHTTPError("Forbidden");
      err.addErrorDetail({
        source: "roleCheck",
        desc: `Role of user is not allowed: ${user.role}`,
      });
      return ctx.sendJson(err);
    }
  };
}
