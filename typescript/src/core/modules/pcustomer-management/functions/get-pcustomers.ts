import { ClientError } from "../../../error";
import { PCustomerDAO } from "../dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";
import type { TInternalContext } from "../../../context/internal-context";
import type { TFindPCustomerParams } from "../dao/type";

/**
 * Lấy danh sách các khác hàng ở trong cơ sở dữ liệu.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function getCustomers(ctx: TRuntimeContext) {
  const query = await ctx.getParams<{ limit: string; startKey: string }>();

  const pcustomerDao = new PCustomerDAO();
  const internalCtx =
    initializeInternalContext() as TInternalContext<TFindPCustomerParams>;

  internalCtx.params = {
    limit: query.limit,
    staryKey: query.startKey,
  };

  const result = await pcustomerDao.listPCustomers(internalCtx);

  if (!result) {
    const err = new ClientError("Customers not found");
    err.asHTTPError("NotFound");
    return err;
  }

  return result;
}
