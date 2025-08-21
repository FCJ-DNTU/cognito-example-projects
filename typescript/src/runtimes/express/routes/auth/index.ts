// Import properties from core
import {
  signInDataProperties,
  signInResultProperties,
  refreshTokensDataProperties,
  refreshTokensResultProperties,
} from "../../../../core/modules/auth/dao/properties";

// Import pipelines from core
import { signInPipeline } from "../../../../core/modules/auth/ports";
import { refreshTokensPipeline } from "../../../../core/modules/auth/ports";

// Import from runtime
import { jsonResponse } from "../../swagger/helpers";
import { createContext } from "../../adapters/context";

// Import types
import type { TRouteDefinition } from "../../swagger/type";

export const authTag = "Auth";
export const authRoutes: TRouteDefinition[] = [
  {
    method: "post",
    path: "/auth/sign-in",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await signInPipeline.run(ctx);
    },
    summary: "Cho phép thực hiện đăng nhập.",
    description:
      "Tiến hành xác thực người dùng dựa trên username và password của người dùng này.",
    tags: [authTag],
    security: {
      bearerAuth: [],
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: signInDataProperties },
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: signInResultProperties,
            },
            meta: { type: "object" },
          },
        },
        "Danh sách của khách hàng tiềm năng.",
      ),
    },
  },
  {
    method: "post",
    path: "/auth/refresh-tokens",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await refreshTokensPipeline.run(ctx);
    },
    summary: "Cho phép làm mới lại các tokens.",
    description: "Làm mới lại Access Token và Id Token dựa vào Refresh Token.",
    tags: [authTag],
    security: {
      bearerAuth: [],
    },
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: refreshTokensDataProperties },
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: refreshTokensResultProperties,
            },
            meta: { type: "object" },
          },
        },
        "Danh sách của khách hàng tiềm năng.",
      ),
    },
  },
];
