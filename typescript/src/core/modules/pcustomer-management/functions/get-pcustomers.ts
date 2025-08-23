import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../data-model/dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";
import type { TInternalContext } from "../../../context/internal-context";
import type { TFindPCustomerParams } from "../data-model/type";

/**
 * Lấy danh sách các khác hàng ở trong cơ sở dữ liệu.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function getCustomers(ctx: TRuntimeContext) {
  try {
    const query = await ctx.getQuery<{ limit: string; startKey: string }>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx =
      initializeInternalContext() as TInternalContext<TFindPCustomerParams>;

    internalCtx.params = {
      limit: query.limit,
      staryKey: query.startKey,
    };
    internalCtx.options!.canCatchError = true;

    const result = await pcustomerDao.listPCustomers(internalCtx);

    return result;
  } catch (error) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot found list of potential customers");
    err.asHTTPError("InternalServerError");
    return err;
  }
}
