import type { TRuntimeContext } from "./type";

/**
 * Khởi tạo một object runtime mẫu để truyền vào trong core.
 *
 * @returns
 */
export function initializeRuntimeContext(): Partial<TRuntimeContext> {
  return {
    runtime: "",
    setHTTPStatus: undefined,
    getBody: undefined,
    getHeaders: undefined,
    getParams: undefined,
    getQuery: undefined,
    sendHTML: undefined,
    sendError: undefined,
    sendJson: undefined,
    sendStreaming: undefined,
    next: undefined,
  };
}

export * from "./type";
