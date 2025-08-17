import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Lấy một người dùng ở trong cơ sở dữ liệu, theo một số điều kiện.
 *
 * @param ctx - runtime context
 */
export async function getCustomer(ctx: TRuntimeContext) {
  const params = await ctx.getParams();
  return ctx.sendJson(params);
}
