import type { AppError } from "../error/AppError";

export type UContextType = "runtime" | "internal";
export type TResponsePayload<TData = unknown, TMeta = unknown> = {
  error?: ReturnType<AppError["toPlain"]>;
  data?: TData;
  meta?: TMeta;
};
