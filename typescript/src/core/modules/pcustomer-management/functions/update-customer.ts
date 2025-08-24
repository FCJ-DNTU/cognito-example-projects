import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../data-model/dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { RuntimeContext } from "../../../context/runtime-context";
import type { InternalContext } from "../../../context/internal-context";
import type { TPCustomer } from "../data-model/type";

/**
 * Cập nhật thông tin của một khách hàng trong hệ thống.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function updateCustomer(ctx: RuntimeContext) {
  try {
    const body = await ctx.getBody<Partial<TPCustomer>>();
    const params = await ctx.getParams<{ id: string }>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx = initializeInternalContext() as InternalContext<
      Partial<TPCustomer>
    >;

    internalCtx.params = { id: params.id, ...body };
    internalCtx.options!.canCatchError = true;

    const result = await pcustomerDao.updatePCustomer(internalCtx);

    return result;
  } catch (error) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot update existing potential customer");
    err.asHTTPError("InternalServerError");
    return err;
  }
}
