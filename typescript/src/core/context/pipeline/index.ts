import { Step } from "./Step";

// Import types
import type { UContextType } from "../type";
import type { TRuntimeContext } from "../runtime-context";
import type { TInternalContext } from "../internal-context";
import type { TStepExecutor } from "./Step";
import type { TPipelineState } from "./type";

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
  private _state: TPipelineState;

  constructor(name: string) {
    this.name = name;
    this._steps = [];
    this._state = {
      currentStep: 0,
      stepCount: 0,
      canStopNow: false,
    };
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
  addStep<TResult = unknown>(executor: TStepExecutor<TContext, TResult>) {
    const newStep = new Step<TContext, TResult>(executor);

    this._steps.push(newStep);
    this._state.stepCount += 1;

    return this;
  }

  /**
   * Cho phép dừng pipeline sau sau một step, mà step này gọi stop().
   */
  stop() {
    this._state.canStopNow = true;
  }

  /**
   * Chạy pipeline theo context được truyền vào.
   */
  async run(ctx: TContext) {
    let currentResult: any;

    for (const step of this._steps) {
      let maybePromise = step.execute(ctx);

      if (maybePromise instanceof Promise) {
        currentResult = await maybePromise;
      } else {
        currentResult = maybePromise;
      }

      (ctx as any)["prevResult"] = currentResult;

      // Process post step execution
      if (this._state.canStopNow) break;

      // Update state
      this._state.currentStep += 1;
    }

    return currentResult;
  }
}
