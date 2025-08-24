import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../data-model/dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { RuntimeContext } from "../../../context/runtime-context";
import type { InternalContext } from "../../../context/internal-context";
import type { TPCustomer } from "../data-model/type";

/**
 * Thêm thông tin của một khách hàng vào trong danh sách.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function addCustomer(ctx: RuntimeContext) {
  try {
    const body = await ctx.getBody<Partial<TPCustomer>>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx = initializeInternalContext() as InternalContext<
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
