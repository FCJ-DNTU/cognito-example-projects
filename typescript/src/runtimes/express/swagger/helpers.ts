// Import types
import type { Express } from "express";
import type {
  TRouteDefinition,
  TSwaggerResponse,
  TSwaggerSchema,
} from "./type";

/**
 * Tạo một phản hồi Json.
 *
 * @param status - http status code.
 * @param schema - response schema.
 * @param [description="Success"].
 */
export function jsonResponse(
  status: string,
  schema: TSwaggerSchema,
  description = "Success",
): Record<string, TSwaggerResponse> {
  return {
    [status]: {
      description,
      content: {
        "application/json": { schema },
      },
    },
  };
}

/**
 * Thêm các routes trong một group route vào trong doc.
 *
 * @param app - express app.
 * @param routes - các routes đã được định nghĩa.
 * @param swaggerDoc - main swagger doc.
 *
 * @returns
 */
export function registerRoutes(
  app: Express,
  routes: TRouteDefinition[],
  swaggerDoc: any,
) {
  routes.forEach((route) => {
    // Swagger Path
    const swaggerPath = route.path.replaceAll(/:(\w+)+/g, "{$1}");

    // Đăng ký vào Express
    (app as any)[route.method](route.path, route.handler);

    // Đăng ký vào Swagger
    swaggerDoc.paths[swaggerPath] = swaggerDoc.paths[swaggerPath] || {};
    (swaggerDoc.paths[swaggerPath] as any)[route.method] = {
      summary: route.summary,
      description: route.description,
      tags: route.tags,
      parameters: route.parameters,
      requestBody: route.requestBody,
      responses: route.responses,
    };
  });
}
