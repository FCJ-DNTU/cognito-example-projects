import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../data-model/dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { RuntimeContext } from "../../../context/runtime-context";
import type { InternalContext } from "../../../context/internal-context";
import type { TDeletePCustomerParams } from "../data-model/type";

/**
 * Xoá thông tin của một khách hàng ra khỏi danh sách.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function deleteCustomer(ctx: RuntimeContext) {
  try {
    const params = await ctx.getParams<{ id: string }>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx =
      initializeInternalContext() as InternalContext<TDeletePCustomerParams>;

    internalCtx.params = {
      query: {
        id: params.id,
      },
    };
    internalCtx.options!.canCatchError = true;

    const result = await pcustomerDao.deletePCustomer(internalCtx);

    return result;
  } catch (error: any) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot delete potential customer");
    err.asHTTPError("InternalServerError");
    return err;
  }
}
