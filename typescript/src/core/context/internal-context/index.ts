import type { TInternalContext } from "./type";

/**
 * Khởi tạo Internal Context cho hàm hoặc các module trong core.
 *
 * @returns
 */
export function initializeInternalContext(): TInternalContext {
  return {
    params: {},
    runtimeCtx: undefined,
    options: {
      canCatchError: false,
    },
  };
}

export * from "./type";
