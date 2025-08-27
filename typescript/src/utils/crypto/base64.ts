import { Buffer } from "buffer";

// Import types
import type { JsonValue, Encodable } from "./type";

/**
 * Mã hoá dữ liệu (có thể chuyển sang sang json) thành base64.
 *
 * @param data - dữ liệu muốn mã hoá.
 *
 * @returns
 */
export function encode(data: Encodable): string {
  const jsonStr = JSON.stringify(data);
  return Buffer.from(jsonStr).toString("base64");
}

/**
 * Giải mã một chuỗi base64 về thành dạng dữ liệu thuần trong js.
 *
 * @param encoded - dữ liệu mã hoá.
 *
 * @returns
 */
export function decode(encoded: string): Encodable {
  const jsonStr = Buffer.from(encoded, "base64").toString();
  const data = JSON.parse(jsonStr);

  if (typeof data === "object" && Array.isArray(data.items)) {
    return data as JsonValue[];
  }

  return data;
}

/**
 * Mã hoá dữ liệu (có thể chuyển sang json) thành base64 an toàn với url.
 *
 * @param data - dữ liệu muốn mã hoá.
 *
 * @returns
 */
export function urlSafeEncode(data: Encodable): string {
  const jsonStr = JSON.stringify(data);

  return Buffer.from(jsonStr).toString("base64url");
}

/**
 * Giả mã chuỗi url safe base64 về dữ liệu thuần trong js.
 *
 * @param encoded - dữ liệu được mã hoá.
 *
 * @returns
 */
export function urlSafeDecode(encoded: string): Encodable {
  const jsonStr = Buffer.from(encoded, "base64url").toString();
  const data = JSON.parse(jsonStr);

  if (typeof data === "object" && Array.isArray(data.items)) {
    return data as JsonValue[];
  }

  return data;
}
