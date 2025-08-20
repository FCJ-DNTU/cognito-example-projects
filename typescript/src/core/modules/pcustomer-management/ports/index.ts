import { Pipeline } from "../../../context/pipeline";

// Import errors
import { ClientError, isStandardError } from "../../../error";

// Import functions
import { getCustomer } from "../functions/get-pcustomer";
import { getCustomers } from "../functions/get-pcustomers";
import { addCustomer } from "../functions/add-customer";
import { updateCustomer } from "../functions/update-customer";
import { deleteCustomer } from "../functions/delete-customer";

// Import validation / validators
import { createValidationStepExecutor } from "../../../validation/joi/helper";
import {
  createPCustomerValidator,
  updatePCustomerValidator,
} from "../validator";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";

const getCustomerPipeline = new Pipeline<TRuntimeContext>(
  "Get Customer Pipeline",
);
const getCustomersPipeline = new Pipeline<TRuntimeContext>(
  "Get Customers Pipeline",
);
const addCustomerPipeline = new Pipeline<TRuntimeContext>(
  "Add Customer Pipeline",
);
const updateCustomerPipeline = new Pipeline<TRuntimeContext>(
  "Update Customer Pipeline",
);
const deleteCustomerPipeline = new Pipeline<TRuntimeContext>(
  "Delete Customer Pipeline",
);

getCustomerPipeline.addStep(getCustomer).addStep<void>((ctx) => {
  if (isStandardError(ctx.prevResult)) {
    return ctx.sendError(ctx.prevResult);
  }

  return ctx.sendJson(ctx.prevResult);
});

getCustomersPipeline.addStep(getCustomers).addStep<void>((ctx) => {
  if (isStandardError(ctx.prevResult)) {
    return ctx.sendError(ctx.prevResult);
  }

  return ctx.sendJson(ctx.prevResult.items, ctx.prevResult.meta);
});

addCustomerPipeline
  .addStep(
    createValidationStepExecutor(addCustomerPipeline, createPCustomerValidator),
  )
  .addStep(addCustomer)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

updateCustomerPipeline
  .addStep(
    createValidationStepExecutor(addCustomerPipeline, updatePCustomerValidator),
  )
  .addStep(updateCustomer)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

deleteCustomerPipeline.addStep(deleteCustomer).addStep<void>((ctx) => {
  if (isStandardError(ctx.prevResult)) {
    return ctx.sendError(ctx.prevResult);
  }

  return ctx.sendJson(ctx.prevResult);
});

export {
  getCustomerPipeline,
  getCustomersPipeline,
  addCustomerPipeline,
  updateCustomerPipeline,
  deleteCustomerPipeline,
};
