// Import errors
import { ClientError } from "../../error";

// Import types
import type { ObjectSchema } from "joi";
import type { Pipeline } from "../../context/pipeline";
import type { RuntimeContext } from "../../context/runtime-context";

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
  schema: ObjectSchema,
) {
  return async function (ctx: RuntimeContext) {
    const body = await ctx.getBody();
    const validated = schema.validate(body);

    if (validated.error) {
      // Stop pipeline
      pipeline.stop(ctx);

      const err = new ClientError(validated.error.message);

      err.asHTTPError("BadRequest");

      for (const detail of validated.error.details) {
        err.addErrorDetail({ source: detail.type, desc: detail.message });
      }

      return ctx.sendError(err);
    }
  };
}

function _toDescriptiveObjectCore(description: any) {
  const result: any = {};

  if (Array.isArray(description)) {
    for (const key of description) {
      result[key] = _toDescriptiveObjectCore(description[key]);
    }

    return result;
  }

  result.type = description.type;

  if (description.type === "object") {
    result.properties = {};

    for (const key in description.keys) {
      result.properties[key] = _toDescriptiveObjectCore(description.keys[key]);
    }
  }

  if (description.type === "array") {
    result.items = _toDescriptiveObjectCore(description.items[0]);
  }

  return result;
}

/**
 * Trả về descriptive object từ joi schema, để dùng trong một số module khác.
 *
 * @param joiSchema - joi schema
 *
 * @returns
 */
export function toDescriptiveObject(joiSchema: ObjectSchema) {
  const description = joiSchema.describe();
  return _toDescriptiveObjectCore(description);
}
