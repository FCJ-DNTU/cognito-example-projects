import { Step } from "./Step";

// Import types
import type { UContextType } from "../type";
import type { TRuntimeContext } from "../runtime-context";
import type { TInternalContext } from "../internal-context";
import type { TStepExecutor } from "./Step";

/**
 * Lớp định nghĩa một pipeline.
 *
 * Khi các steps được chạy trong một pipeline, thì step sau có
 * thể sẽ có được kết quả từ step trước đó. Trong trường hợp này
 * thì kết quả đó sẽ được hiểu là params cho step tiếp theo.
 * Chính vì thế, khi sử dụng pipeline trong core thì mình phải lưu ý.
 */
export class Pipeline<TContext = TRuntimeContext | TInternalContext> {
  public name: string;

  private _steps: Array<Step<TContext, unknown>>;

  constructor(name: string) {
    this.name = name;
    this._steps = [];
  }

  /**
   * Trả về các steps trong một pipeline.
   *
   * @returns
   */
  getSteps() {
    return this._steps;
  }

  /**
   * Thêm một step mới vào trong pipeline.
   *
   * @param executor - executor của step.
   * @param ctxType - kiểu context mà step chạy.
   */
  addStep<TResult = unknown>(
    executor: TStepExecutor<TContext, TResult>,
    ctxType?: UContextType,
  ) {
    const newStep = new Step<TContext, TResult>(ctxType, executor);
    this._steps.push(newStep);
  }

  /**
   * Chạy pipeline theo context được truyền vào.
   */
  run(ctx: TContext) {
    let currentResult: any;

    for (const step of this._steps) {
      currentResult = step.execute(ctx);
      (ctx as any)["prevResult"] = currentResult;
    }

    return currentResult;
  }
}
