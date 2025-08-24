// Import properties from core
import {
  signInDataDescriptiveObject,
  signInResultDescriptiveObject,
  refreshTokensDataDescriptiveObject,
  refreshTokensResultDescriptiveObject,
} from "../../../../core/modules/auth/data-model/schema";

// Import pipelines from core
import { signInPipeline } from "../../../../core/modules/auth/ports";
import { refreshTokensPipeline } from "../../../../core/modules/auth/ports";

// Import from runtime
import { jsonResponse } from "../../../../core/docs/swagger/helpers";
import { ExpressRuntimeContext } from "../../adapters/context";

// Import types
import type { TRouteDefinition } from "../../../../core/docs/swagger/type";

export const authTag = "Auth";
export const authRoutes: TRouteDefinition[] = [
  {
    method: "post",
    path: "/auth/sign-in",
    handler: async (req, res, next) => {
      const ctx = new ExpressRuntimeContext(req, res, next);
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
          schema: signInDataDescriptiveObject,
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: signInResultDescriptiveObject,
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
      const ctx = new ExpressRuntimeContext(req, res, next);
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
        "application/json": refreshTokensDataDescriptiveObject,
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: refreshTokensResultDescriptiveObject,
            meta: { type: "object" },
          },
        },
        "Danh sách của khách hàng tiềm năng.",
      ),
    },
  },
];
