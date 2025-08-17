import type { TRuntimeContext } from "../runtime-context";

/**
 * Ở trong core thì cũng có context của riêng nó, gọi là Internal Context.
 */
export type TInternalContext<
  TParams = unknown,
  TExtOptions extends Record<string, any> = {},
> = {
  /**
   * Tham số chính của hàm/module.
   */
  params: TParams;

  /**
   * Kết quả của lần thực thi trước nếu đang ở trong pipeline.
   */
  prevResult?: any;

  /**
   * Context từ runtime.
   */
  runtimeCtx?: Partial<TRuntimeContext>;

  /**
   * Một số các tham số thêm cho hàm/module để xử lý.
   */
  options?: {
    /**
     * Cho biết là context ở ngoài hàm/module này có thể bắt được lỗi hay không?
     * Nếu không thì mình phải xử lý dữ liệu rồi trả về undefined hoặc null
     * hoặc [] hoặc bất cứ giá trị nào. Mặc định là `true`.
     */
    canCatchError: boolean;
  } & TExtOptions;
};
