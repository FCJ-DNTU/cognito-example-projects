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

export type TSwaggerSchema = {
  type: string;
  items?: TSwaggerSchema;
  properties?: {
    [K: string]: TSwaggerSchema;
  };
};

export type TSwaggerParameters = {
  name: string;
  in: string;
  required?: boolean;
  schema: TSwaggerSchema;
  description?: string;
};

export type TRouteDefinition = {
  method: HTTPMethod;
  path: string;
  handler: RequestHandler;
  security?: {
    bearerAuth?: Array<any>;
  };
  summary?: string;
  description?: string;
  tags?: Array<string>;
  parameters?: Array<TSwaggerParameters>;
  requestBody?: {
    required?: boolean;
    content: {
      [contentType: string]: {
        schema: TSwaggerSchema;
      };
    };
  };
  responses?: {
    [statusCode: string]: TSwaggerResponse;
  };
};
