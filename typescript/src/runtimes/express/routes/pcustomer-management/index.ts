// Import ports from modules
import {
  getCustomerPipeline,
  getCustomersPipeline,
  addCustomerPipeline,
  updateCustomerPipeline,
  deleteCustomerPipeline,
} from "../../../../core/modules/pcustomer-management/ports";

// Import from runtime
import { jsonResponse } from "../../swagger/helpers";
import { createContext } from "../../adapters/context";

// Import types
import type { TRouteDefinition } from "../../swagger/type";

export const pcustomersTag = "Potential Customer";
export const pcustomersRoutes: TRouteDefinition[] = [
  {
    method: "get",
    path: "/pcustomers",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await getCustomersPipeline.run(ctx);
    },
    summary: "Get potential customers from database",
    description: "Get potential customers from database",
    tags: [pcustomersTag],
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            items: { type: "array", items: { type: "string" } },
            meta: { type: "object" },
          },
        },
        "List of Potential Customer",
      ),
    },
  },
  {
    method: "get",
    path: "/pcustomers/:id",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await getCustomerPipeline.run(ctx);
    },
    summary: "Get a potential customer from database",
    description: "Get a potential customer from database by id",
    tags: [pcustomersTag],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "Customer ID",
      },
    ],
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        "A Potential Customer",
      ),
    },
  },
];
