import { Pipeline } from "../../../context/pipeline";

// Import errors
import { ClientError, isStandardError } from "../../../error";

// Import functions
import { signIn } from "../functions/sign-in";
import { refreshTokens } from "../functions/refresh-tokens";

// Import schema & validators
import {
  signInDataSchema,
  refreshTokensDataSchema,
} from "../data-model/schema";
import { createValidationStepExecutor } from "../../../validation/joi/helper";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";

const signInPipeline = new Pipeline<TRuntimeContext>("Sign In Pipeline");
const refreshTokensPipeline = new Pipeline<TRuntimeContext>(
  "Refresh Tokens Pipeline",
);

signInPipeline
  .addStep(createValidationStepExecutor(signInPipeline, signInDataSchema))
  .addStep(signIn)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

refreshTokensPipeline
  .addStep(
    createValidationStepExecutor(
      refreshTokensPipeline,
      refreshTokensDataSchema,
    ),
  )
  .addStep(refreshTokens)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

export { signInPipeline, refreshTokensPipeline };
