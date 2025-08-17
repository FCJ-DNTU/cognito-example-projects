// Import ports from modules
import { getCustomerPipeline } from "../../../../core/modules/pcustomer-management/ports";
import { createContext } from "../../adapters/context";

// Import from runtime
import { jsonResponse } from "../../swagger/helpers";

// Import types
import type { TRouteDefinition } from "../../swagger/type";

export const pcustomersTag = "Potential Customer";
export const pcustomersRoutes: TRouteDefinition[] = [
  {
    method: "get",
    path: "/pcustomers/:id",
    handler: (req, res, next) => {
      const ctx = createContext(req, res, next);
      return getCustomerPipeline.run(ctx);
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
        "Khách hàng tiềm năng",
      ),
    },
  },
];
