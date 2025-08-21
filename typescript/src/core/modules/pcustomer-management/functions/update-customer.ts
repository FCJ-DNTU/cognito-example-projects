import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";
import type { TInternalContext } from "../../../context/internal-context";
import type { TPCustomer } from "../dao/type";

/**
 * Cập nhật thông tin của một khách hàng trong hệ thống.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function updateCustomer(ctx: TRuntimeContext) {
  try {
    const body = await ctx.getBody<Partial<TPCustomer>>();
    const params = await ctx.getParams<{ id: string }>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx = initializeInternalContext() as TInternalContext<
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
