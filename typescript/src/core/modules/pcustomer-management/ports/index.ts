import { Pipeline } from "../../../context/pipeline";

// Import constants
import { ROLES } from "../../auth/constants";
import { TEAMS } from "../../auth/constants";

// Import errors
import { ClientError, isStandardError } from "../../../error";

// Import functions
import { getCustomer } from "../functions/get-pcustomer";
import { getCustomers } from "../functions/get-pcustomers";
import { addCustomer } from "../functions/add-customer";
import { updateCustomer } from "../functions/update-customer";
import { deleteCustomer } from "../functions/delete-customer";
import { createVerifyTokenStepExecutor } from "../../auth/functions/verify-token";
import { createTeamsCheckStepExecutor } from "../../auth/functions/check-teams";
import { createRolesCheckStepExecutor } from "../../auth/functions/check-role";

// Import validation / validators
import { createValidationStepExecutor } from "../../../validation/joi/helper";
import {
  createPCustomerValidator,
  updatePCustomerValidator,
} from "../validator";

// Import types
import type { RuntimeContext } from "../../../context/runtime-context";

const getCustomerPipeline = new Pipeline<RuntimeContext>(
  "Get Customer Pipeline",
);
const getCustomersPipeline = new Pipeline<RuntimeContext>(
  "Get Customers Pipeline",
);
const addCustomerPipeline = new Pipeline<RuntimeContext>(
  "Add Customer Pipeline",
);
const updateCustomerPipeline = new Pipeline<RuntimeContext>(
  "Update Customer Pipeline",
);
const deleteCustomerPipeline = new Pipeline<RuntimeContext>(
  "Delete Customer Pipeline",
);

getCustomerPipeline
  .addStep(createVerifyTokenStepExecutor(getCustomerPipeline))
  .addStep(
    createRolesCheckStepExecutor(getCustomerPipeline, [
      ROLES.EMPLOYEE.NAME,
      ROLES.ADMIN.NAME,
    ]),
  )
  .addStep(
    createTeamsCheckStepExecutor(getCustomerPipeline, [
      TEAMS.MARKETING.NAME,
      TEAMS.SALES.NAME,
    ]),
  )
  .addStep(getCustomer)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

getCustomersPipeline
  .addStep(createVerifyTokenStepExecutor(getCustomersPipeline))
  .addStep(
    createRolesCheckStepExecutor(getCustomersPipeline, [
      ROLES.EMPLOYEE.NAME,
      ROLES.ADMIN.NAME,
    ]),
  )
  .addStep(
    createTeamsCheckStepExecutor(getCustomersPipeline, [
      TEAMS.MARKETING.NAME,
      TEAMS.SALES.NAME,
    ]),
  )
  .addStep(getCustomers)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult.items, ctx.prevResult.meta);
  });

addCustomerPipeline
  .addStep(createVerifyTokenStepExecutor(addCustomerPipeline))
  .addStep(
    createValidationStepExecutor(addCustomerPipeline, createPCustomerValidator),
  )
  .addStep(
    createRolesCheckStepExecutor(addCustomerPipeline, [
      ROLES.EMPLOYEE.NAME,
      ROLES.ADMIN.NAME,
    ]),
  )
  .addStep(
    createTeamsCheckStepExecutor(addCustomerPipeline, [TEAMS.SALES.NAME]),
  )
  .addStep(addCustomer)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

updateCustomerPipeline
  .addStep(createVerifyTokenStepExecutor(updateCustomerPipeline))
  .addStep(
    createRolesCheckStepExecutor(updateCustomerPipeline, [
      ROLES.EMPLOYEE.NAME,
      ROLES.ADMIN.NAME,
    ]),
  )
  .addStep(
    createTeamsCheckStepExecutor(updateCustomerPipeline, [TEAMS.SALES.NAME]),
  )
  .addStep(
    createValidationStepExecutor(
      updateCustomerPipeline,
      updatePCustomerValidator,
    ),
  )
  .addStep(updateCustomer)
  .addStep<void>((ctx) => {
    if (isStandardError(ctx.prevResult)) {
      return ctx.sendError(ctx.prevResult);
    }

    return ctx.sendJson(ctx.prevResult);
  });

deleteCustomerPipeline
  .addStep(createVerifyTokenStepExecutor(deleteCustomerPipeline))
  .addStep(
    createRolesCheckStepExecutor(deleteCustomerPipeline, [
      ROLES.EMPLOYEE.NAME,
      ROLES.ADMIN.NAME,
    ]),
  )
  .addStep(
    createTeamsCheckStepExecutor(deleteCustomerPipeline, [TEAMS.SALES.NAME]),
  )
  .addStep(deleteCustomer)
  .addStep<void>((ctx) => {
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
