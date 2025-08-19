// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";

/**
 * Lấy danh sách các khác hàng ở trong cơ sở dữ liệu.
 *
 * @param ctx - runtime context.
 *
 * @returns
 */
export async function getCustomers(ctx: TRuntimeContext) {
  return ctx.sendJson([], { size: 0 });
}
