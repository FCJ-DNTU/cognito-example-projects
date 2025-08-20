import type { Readable } from "stream";
import type { AppError } from "../../error/AppError";
import type { ClientError } from "../../error/ClientError";

/**
 * Trong mỗi runtime khác nhau sẽ có các input khác nhau, vì thế mà
 * mình sẽ cần phải tạo ra một tiêu chuẩn để cho core có thể dùng được
 * gì từ những runtime đó mà không cần phải sử dụng trực tiếp runtime
 * đó trong phần definition của core. Ví dụ như với Express, mình sẽ có
 * Request, Response và NextFunction nhưng các runtime khác thì có thể
 * sẽ có các chuẩn input khác nhau. Đó là lý do vì sao mà mình phải
 * định nghĩa ra Runtime Context để chuẩn hoá.
 *
 * Trong này thì mình có thể thấy là context nó bao gồm cả properties
 * và methods. Trong đó bạn có thể thấy có nhiều methods lấy input
 * (tiền tố get) và có nhiều methods gửi output (tiền tố send).
 *
 * Ngoài ra thì còn có một số hàm khác nữa.
 */
export type TRuntimeContext = {
  /** Name of runtime */
  runtime: string;

  /**
   * Kết quả của lần thực thi trước nếu đang ở trong pipeline.
   */
  prevResult?: any;

  /**
   * Gán giá trị http status code.
   *
   * @param status - Mã http status code hợp lệ.
   */
  setHTTPStatus(status: number): void;

  /**
   * Lấy body trong HTTP Request (Payload), nếu request có body.
   *
   * @returns
   */
  getBody<T = unknown>(): Promise<T>;

  /**
   * Lấy phần query trong URL.
   *
   * @returns
   */
  getQuery<T = unknown>(): Promise<T>;

  /**
   * Lấy các tham số ở trong phần pathname của URL.
   *
   * @returns
   */
  getParams<T = unknown>(): Promise<T>;

  /**
   * Lấy Request Headers.
   *
   * @returns
   */
  getHeaders<T = unknown>(): Promise<T>;

  /**
   * Thiết lập giá trị mới cho body, hoặc là update.
   *
   * @param body - body mới hoặc một phần body mới.
   *
   * @returns
   */
  setBody(body: ((oldBody: any) => any) | any): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một Streaming Response.
   *
   * @param stream - dữ liệu truyền về là một dạng stream.
   * @param contentType - kiểu content trả về, phải phù hợp với stream.
   */
  sendStreaming(source: Readable | Buffer, contentType?: string): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một JSON Response.
   *
   * @param data - dữ liệu trả về (kết quả).
   * @param meta - các thông tin thêm trong quá trình thực hiện hoặc là của chính kết quả.
   */
  sendJson(data: unknown, meta?: unknown): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một HTML Response.
   *
   * @param htmlStr - một chuỗi trả về theo chuẩn HTML.
   */
  sendHTML(htmlStr: string): void;

  /**
   * Gửi lại Client bên ngoài runtime (requester) một Error Response theo chuẩn JSON.
   *
   * @param error - lỗi phản hồi, có thể là `ClientErrror` hoặc `AppError`.
   */
  sendError(error: AppError | ClientError): void;

  /**
   * Hàm next trong một số runtime.
   */
  next?(): void;
};
