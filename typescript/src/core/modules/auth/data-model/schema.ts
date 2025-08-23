import joi from "joi";

// Import constants
import { USERNAME_REGEX, PASSWORD_REGEX } from "../../../../utils/constants";

import { toDescriptiveObject } from "../../../validation/joi/helper";

export const signInDataSchema = joi.object({
  username: joi.string().pattern(USERNAME_REGEX).required().messages({
    "string.pattern.base":
      "Username must be 3–30 characters long and only contain letters, numbers, dots (.), underscores (_) or hyphens (-).",
    "string.base": "Username must be a string.",
    "string.empty": "Username cannot be empty.",
    "any.required": "Username is required.",
  }),
  password: joi.string().pattern(PASSWORD_REGEX).required().messages({
    "string.pattern.base":
      "Password must be 8–256 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    "string.base": "Password must be a string.",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
});

export const refreshTokensDataSchema = joi.object({
  refreshToken: joi.string().required().messages({
    "string.base": "RefreshToken must be a string",
    "string.empty": "RefreshToken cannot be empty",
    "any.required": "RefreshToken is required",
  }),
});

export const signInDataDescriptiveObject =
  toDescriptiveObject(signInDataSchema);

export const signInResultDescriptiveObject = {
  type: "object",
  properties: {
    auth: {
      type: "object",
      properties: {
        idToken: { type: "string" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
  },
};

export const refreshTokensDataDescriptiveObject = toDescriptiveObject(
  refreshTokensDataSchema,
);

export const refreshTokensResultDescriptiveObject = {
  type: "object",
  properties: {
    auth: {
      type: "object",
      properties: {
        idToken: { type: "string" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
  },
};
