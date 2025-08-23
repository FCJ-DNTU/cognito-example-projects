import joi from "joi";

// Import constants
import {
  CUSTOMER_ID_PREFIX_REGEX,
  VIETNAMESE_NAME_REGEX,
  VIETNAMESE_PHONENUMBER_REGEX,
  SNAKECASE_REGEX,
  ISO8601_DATETIME_REGEX,
} from "../../../../utils/constants";

import { toDescriptiveObject } from "../../../validation/joi/helper";

// Định nghĩa các field / property thành validator

export const idSchema = joi.string().pattern(CUSTOMER_ID_PREFIX_REGEX);
export const fullNameSchema = joi
  .string()
  .pattern(VIETNAMESE_NAME_REGEX)
  .messages({
    "string.pattern.base":
      "fullName must be a valid VietNamese Name. Don't include any special character.",
    "string.base": "fullName must be a string",
    "string.empty": "fullName cannot be empty",
    "any.required": "fullName is required",
  });
export const phoneSchema = joi
  .string()
  .pattern(VIETNAMESE_PHONENUMBER_REGEX)
  .messages({
    "string.pattern.base": "phone must be a valid VietNamese phone number",
    "string.base": "phone number must be a string",
    "any.required": "phone number is required",
  });
export const ageSchema = joi.number().min(18).max(90);
export const productCodeSchema = joi
  .string()
  .pattern(SNAKECASE_REGEX)
  .messages({
    "string.pattern.base":
      "ProductCode must be a valid snake_case and don't include any special character.",
    "string.base": "productCode must be a string",
    "string.empty": "productCode cannot be empty",
    "any.required": "productCode is required",
  });
export const createAtSchema = joi
  .string()
  .pattern(ISO8601_DATETIME_REGEX)
  .messages({
    "string.pattern.base":
      "createAt must be a valid ISO 8601 Date String as full length.",
    "string.base": "createAt must be a string",
    "string.empty": "createAt cannot be empty",
    "any.required": "createAt is required",
  });

// Định nghĩa dict / object thành validator

export const createPCustomerSchema = joi.object({
  fullName: fullNameSchema.required(),
  phone: phoneSchema.required(),
  age: ageSchema.required(),
  productCode: productCodeSchema.required(),
});

export const updatePCustomerSchema = joi.object({
  fullName: fullNameSchema,
  phone: phoneSchema,
  age: ageSchema,
  productCode: productCodeSchema,
});

export const pcustomerDescriptiveObject = {
  type: "object",
  properties: {
    id: { type: "string" },
    fullName: { type: "string" },
    phone: { type: "string" },
    age: { type: "number" },
    type: { type: "string" },
    productCode: { type: "string" },
    createAt: { type: "string" },
  },
};

export const createPCustomerDescriptiveObject = toDescriptiveObject(
  createPCustomerSchema,
);

export const updatePCustomerDescriptiveObject = toDescriptiveObject(
  updatePCustomerSchema,
);
