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
  const body = await ctx.getBody<Partial<TPCustomer>>();

  const pcustomerDao = new PCustomerDAO();
  const internalCtx = initializeInternalContext() as TInternalContext<
    Partial<TPCustomer>
  >;

  internalCtx.params = body;

  const result = await pcustomerDao.updatePCustomer(internalCtx);

  return result;
}
