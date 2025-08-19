// Import types
import type { TInternalContext } from "../internal-context";

export type TFindByIdFn<TFindResult = unknown> = (
  ctx: TInternalContext,
) => Promise<TFindResult>;

export type TFindByQueryFn<TQuery = unknown, TFindResult = unknown> = (
  ctx: TInternalContext<{ query: TQuery }>,
) => Promise<TFindResult>;

export type TInsertFn<TData = unknown, TInsertResult = unknown> = (
  ctx: TInternalContext<TData>,
) => Promise<TInsertResult>;

export type TUpdateFn<TData = unknown, TUpdateResult = unknown> = (
  ctx: TInternalContext<TData>,
) => Promise<TUpdateResult>;

export type TDeleteByQuery<TQuery = unknown, TDeleteResult = unknown> = (
  ctx: TInternalContext<{ query: TQuery }>,
) => Promise<TDeleteResult>;
