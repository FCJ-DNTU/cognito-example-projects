import { Step } from "./Step";

// Import types
import type { TRuntimeContext } from "../runtime-context";
import type { TInternalContext } from "../internal-context";
import type { TStepExecutor } from "./Step";
import type { TPipelineRunState } from "./type";

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
  private _runStates: Map<any, TPipelineRunState>;

  constructor(name: string) {
    this.name = name;
    this._steps = [];
    this._runStates = new Map<any, TPipelineRunState>();
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

    return this;
  }

  /**
   * Cho phép dừng pipeline sau sau một step, mà step này gọi stop().
   */
  stop(ctx: TContext) {
    let currState = this._runStates.get(ctx);

    if (!currState) return;

    currState.canStopNow = true;
  }

  /**
   * Chạy pipeline theo context được truyền vào.
   */
  async run(ctx: TContext) {
    let currentResult: any;

    this._runStates.set(ctx, { currentStep: 0, canStopNow: false });

    for (const step of this._steps) {
      let maybePromise = step.execute(ctx);

      if (maybePromise instanceof Promise) {
        currentResult = await maybePromise;
      } else {
        currentResult = maybePromise;
      }

      (ctx as any)["prevResult"] = currentResult;

      // Process post step execution
      if (this._runStates.get(ctx)!.canStopNow) break;

      // Update state
      this._runStates.get(ctx)!.currentStep += 1;
    }

    // Clear state
    this._runStates.delete(ctx);

    return currentResult;
  }
}
