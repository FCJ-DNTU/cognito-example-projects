/**
 * Kiểm tra xem một chuỗi có rỗng hay không.
 *
 * @param value - giá trị muốn kiểm tra.
 *
 * @returns
 */
export function isEmpty(value: any) {
  if (typeof value !== "string") return false;

  value = value.trim();

  return value === "";
}
