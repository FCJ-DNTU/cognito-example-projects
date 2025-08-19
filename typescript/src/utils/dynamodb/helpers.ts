import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// Import errors
import { ClientError } from "../../core/error";

// Import helpers
import { isNumber } from "../helpers/number";

/**
 * Replace Decimal-like values with native JS numbers
 *
 * @param obj - đối tượng muốn chuyển đổi.
 *
 * @returns
 */
export function replaceDecimals(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(replaceDecimals);
  } else if (typeof obj === "object" && obj !== null) {
    const result: Record<string, any> = {};

    for (const key in obj) {
      result[key] = replaceDecimals(obj[key]);
    }

    return result;
  } else if (typeof obj === "object" && "toFixed" in obj) {
    const num = Number(obj);

    return Number.isInteger(num) ? Math.floor(num) : num;
  }

  return obj;
}

/**
 * Lấy dữ liệu của một thuộc tính trong một item.
 *
 * @param item - dynamodb item muốn lấy.
 * @param attrName - thuộc tính muốn lấy.
 * @param type - kiểu dữ liệu.
 */
export function getValueOfAttrItem(
  item: Record<string, AttributeValue> | undefined,
  attrName: string | undefined,
  type: keyof AttributeValue | undefined,
): any {
  if (!item || !attrName || !type) return null;
  return item[attrName]?.[type] ?? null;
}

/**
 * Chuyển native JS object về chuẩn cấu trúc của dynamodb item.
 *
 * @param plain - - native js object.
 *
 * @returns
 */
export function toDynamoDBItem(
  plain: Record<string, any>,
): Record<string, AttributeValue> {
  return marshall(plain);
}

/**
 * Chuyển dynamodb item về chuẩn của native js object.
 *
 * @param dynamoItem - dynamodb item muốn chuyển đổi.
 *
 * @returns
 */
export function fromDynamoDBItem(
  dynamoItem: Record<string, AttributeValue>,
): Record<string, any> {
  return unmarshall(dynamoItem);
}

/**
 * Xây dựng ExpressionAttributeValues.
 *
 * @param [obj=null] - dữ liệu đầu vào.
 * @param [allowedAttrs=null] - danh sách cách thuộc tính có thể chuyển đổi.
 *
 * @returns
 */
function _buildExpressionAttrValues(
  obj: Record<string, any> | null = null,
  allowedAttrs: string[] | null = null,
  fn?: (key: string, value: any) => void,
) {
  const expressionAttrValues: Record<string, AttributeValue> = {};

  if (!obj) return expressionAttrValues;

  for (const key of Object.keys(obj)) {
    if (allowedAttrs && allowedAttrs.length > 0 && !allowedAttrs.includes(key))
      continue;

    const value = obj[key];
    const placeholder = `:${key}`;

    if (isNumber(value)) {
      expressionAttrValues[placeholder] = { N: value.toString() };
    } else if (typeof value === "string") {
      expressionAttrValues[placeholder] = { S: value };
    } else if (Array.isArray(value)) {
      expressionAttrValues[placeholder] = { L: value.map((v) => marshall(v)) };
    } else if (typeof value === "object" && value !== null) {
      expressionAttrValues[placeholder] = { M: marshall(value) };
    } else if (typeof value === "boolean") {
      expressionAttrValues[placeholder] = { BOOL: value };
    } else if (value instanceof Set) {
      const arr = Array.from(value);
      const typeSet = typeof arr[0];
      if (!arr.every((v) => typeof v === typeSet)) {
        throw new ClientError(`Inconsistent types in set for key ${key}`);
      }
      if (typeSet === "string") {
        expressionAttrValues[placeholder] = { SS: arr as string[] };
      } else if (typeSet === "number") {
        expressionAttrValues[placeholder] = { NS: arr.map(String) };
      }
    }

    if (fn) fn(key, obj[key]);
  }

  return expressionAttrValues;
}

/**
 * Xây dựng SetUpdateExpression.
 *
 * @param [obj=null] - dữ liệu đầu vào.
 * @param [allowedAttrs=null] - danh sách cách thuộc tính có thể chuyển đổi.
 *
 * @returns
 */
export function buildSetUpdateExpression(
  obj: Record<string, any> | null = null,
  allowedAttrs: string[] | null = null,
):
  | {
      setExpression: string;
      expressionAttrValues: Record<string, AttributeValue>;
    }
  | undefined {
  if (!obj) return;

  let setExpression = "";
  const expressionAttrValues = _buildExpressionAttrValues(
    obj,
    allowedAttrs,
    (key) => {
      if (setExpression === "") setExpression = "SET";
      setExpression += ` ${key} = :${key},`;
    },
  );

  setExpression = setExpression.slice(0, -1);

  return { setExpression, expressionAttrValues };
}

export function buildConditionExpression(
  obj: Record<string, any> | null = null,
) {
  if (!obj) return;

  const expressionAttrValues = _buildExpressionAttrValues(obj);
}
