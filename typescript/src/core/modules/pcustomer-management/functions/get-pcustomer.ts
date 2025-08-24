import { AppError, isStandardError } from "../../../error";
import { PCustomerDAO } from "../data-model/dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { RuntimeContext } from "../../../context/runtime-context";
import type { InternalContext } from "../../../context/internal-context";
import type { TFindPCustomerParams } from "../data-model/type";

/**
 * Lấy một người dùng ở trong cơ sở dữ liệu, theo một số điều kiện.
 *
 * @param ctx - runtime context
 */
export async function getCustomer(ctx: RuntimeContext) {
  try {
    const params = await ctx.getParams<{ id: string }>();

    const pcustomerDao = new PCustomerDAO();
    const internalCtx =
      initializeInternalContext() as InternalContext<TFindPCustomerParams>;

    internalCtx.params = {
      query: { id: params.id },
    };
    internalCtx.options!.canCatchError = true;

    const result = await pcustomerDao.getPCustomer(internalCtx);

    return result;
  } catch (error) {
    if (isStandardError(error)) return error;

    const err = new AppError("Cannot get a potential customer");
    err.asHTTPError("InternalServerError");
    return err;
  }
}
