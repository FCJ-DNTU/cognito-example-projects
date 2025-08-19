/**
 * Kiểm tra xem một giá trị có thật sự là number hay không?
 *
 * @param value - giá trị muốn kiểm tra.
 *
 * @returns
 */
export function isActualNumber(value: any) {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Kiểm tra xem một giá trị có phải là number hay không?
 *
 * @param value - giá trị muốn kiểm tra.
 *
 * @returns
 */
export function isNumber(value: any) {
  if (isNaN(value)) return false;

  try {
    let integerValue = parseInt(value);
    let floatValue = parseFloat(value);

    if (typeof integerValue === "number" && !isNaN(integerValue)) return true;
    if (typeof floatValue === "number" && !isNaN(floatValue)) return true;
    if (typeof value !== "number") return false;

    return true;
  } catch (error) {
    return false;
  }
}
