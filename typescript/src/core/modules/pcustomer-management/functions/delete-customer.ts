import { PCustomerDAO } from "../dao";
import { initializeInternalContext } from "../../../context/internal-context";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";
import type { TInternalContext } from "../../../context/internal-context";
import type { TDeletePCustomerParams } from "../dao/type";

/**
 * Xoá thông tin của một khách hàng ra khỏi danh sách.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function deleteCustomer(ctx: TRuntimeContext) {
  const params = await ctx.getParams<{ id: string }>();

  const pcustomerDao = new PCustomerDAO();
  const internalCtx =
    initializeInternalContext() as TInternalContext<TDeletePCustomerParams>;

  internalCtx.params = {
    query: {
      id: params.id,
    },
  };

  const result = await pcustomerDao.deletePCustomer(internalCtx);

  return result;
}
