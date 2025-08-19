// Import errors
import { AppError } from "../../core/error";

// Import helpers
import { isEmpty } from "./string";

/**
 * Kiểm tra và có thể ném lỗi nếu như chuỗi là rỗng.
 *
 * @param value - giá trị cần kiểm tra.
 * @param valueName - tên của giá trị.
 * @param msg - message lỗi tuỳ chỉnh.
 *
 * @returns
 */
export function checkEmptyOrThrowError(
  value: any,
  valueName: string,
  msg?: string,
) {
  if (!msg) {
    msg = `${valueName} is empty`;
  }

  if (isEmpty(value)) {
    throw new AppError(msg);
  }
}

/**
 * Kiểm tra và có thể ném lỗi nếu như giá trị là undefined.
 *
 * @param value - giá trị cần kiểm tra.
 * @param valueName - tên của giá trị.
 * @param msg - message lỗi tuỳ chỉnh.
 *
 * @returns
 */
export function checkUndefinedOrThrowError(
  value: any,
  valueName: string,
  msg?: string,
) {
  if (!msg) {
    msg = `${valueName} is undefined`;
  }

  if (value === undefined) {
    throw new AppError(msg);
  }
}

/**
 * Kiểm tra và có thể ném lỗi nếu như giá trị là null.
 *
 * @param value - giá trị cần kiểm tra.
 * @param valueName - tên của giá trị.
 * @param msg - message lỗi tuỳ chỉnh.
 *
 * @returns
 */
export function checkNullOrThrowError(
  value: any,
  valueName: string,
  msg?: string,
) {
  if (!msg) {
    msg = `${valueName} is undefined`;
  }

  if (value === null) {
    throw new AppError(msg);
  }
}

/**
 * Kiểm tra và có thể ném lỗi nếu như giá trị không tồn tại.
 *
 * @param value - giá trị cần kiểm tra.
 * @param valueName - tên của giá trị.
 * @param msg - message lỗi tuỳ chỉnh.
 *
 * @returns
 */
export function checkExistanceOrThrowError(
  value: any,
  valueName: string,
  msg?: string,
) {
  checkUndefinedOrThrowError(value, valueName, msg);
  checkNullOrThrowError(value, valueName, msg);
}

/**
 * Kiểm tra và có thể ném lỗi nếu như một prop không tồn tại trong obj.
 *
 * @param obj - obj cần kiểm tra.
 * @param objName - tên của object.
 * @param propName - tên của prop cần kiểm tra.
 * @param msg - message lỗi tuỳ chỉnh.
 */
export function checkPropInObjOrThrowError(
  obj: any,
  objName: string,
  propName: string,
  msg?: string,
) {
  if (!msg) {
    msg = `${propName} must be in ${objName}`;
  }

  if (!(`${propName}` in obj) && !obj[propName]) {
    throw new AppError(msg);
  }
}
