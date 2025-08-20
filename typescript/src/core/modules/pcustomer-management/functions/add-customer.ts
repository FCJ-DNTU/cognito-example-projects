import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";
import type { TInternalContext } from "../../../context/internal-context";
import type { TPCustomer } from "../dao/type";

/**
 * Thêm thông tin của một khách hàng vào trong danh sách.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function addCustomer(ctx: TRuntimeContext) {
  try {
    const body = await ctx.getBody<Partial<TPCustomer>>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx = initializeInternalContext() as TInternalContext<
      Partial<TPCustomer>
    >;

    internalCtx.params = body;
    internalCtx.options!.canCatchError = true;

    const result = await pcustomerDao.insertPCustomer(internalCtx);

    return result;
  } catch (error: any) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot add new potential customer");
    err.asHTTPError("InternalServerError");
    return err;
  }
}
