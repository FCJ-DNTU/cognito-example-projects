import type { RequestHandler } from "express";

export type HTTPMethod = "get" | "post" | "put" | "delete" | "patch";

export type TSwaggerResponse = {
  description: string;
  content?: {
    [contentType: string]: {
      schema: object;
    };
  };
};

export type TRouteDefinition = {
  method: HTTPMethod;
  path: string;
  handler: RequestHandler;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: object[];
  requestBody?: {
    required?: boolean;
    content: {
      [contentType: string]: {
        schema: object;
      };
    };
  };
  responses?: {
    [statusCode: string]: TSwaggerResponse;
  };
};
