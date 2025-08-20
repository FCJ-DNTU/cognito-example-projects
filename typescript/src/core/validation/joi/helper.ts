// Import errors
import { ClientError } from "../../error";

// Import types
import type { ObjectSchema } from "joi";
import type { Pipeline } from "../../context/pipeline";
import type { TRuntimeContext } from "../../context/runtime-context";

/**
 * Tạo executor cho bước xác minh dữ liệu trong pipeline.
 *
 * @param pipeline - pipeline mà mình muốn thêm step vào.
 * @param validator - validator mà mình muốn dùng để xác minh.
 *
 * @returns
 */
export function createValidationStepExecutor(
  pipeline: Pipeline<any>,
  validator: ObjectSchema,
) {
  return async function (ctx: TRuntimeContext) {
    const body = await ctx.getBody();
    const validated = validator.validate(body);

    if (validated.error) {
      // Stop pipeline
      pipeline.stop();

      const err = new ClientError(validated.error.message);

      err.asHTTPError("BadRequest");

      for (const detail of validated.error.details) {
        err.addErrorDetail({ source: detail.type, desc: detail.message });
      }

      return ctx.sendError(err);
    }
  };
}
