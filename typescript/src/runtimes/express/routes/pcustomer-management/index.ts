// Import properties from core
import {
  pcustomerProperties,
  pcustomerToAddProperties,
  pcustomerToUpdateProperties,
} from "../../../../core/modules/pcustomer-management/dao/properties";

// Import pipelines from core
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
    summary: "Lấy các khách hàng tiềm năng.",
    description: "Lấy các khách hàng tiềm năng ở trong hệ thống.",
    tags: [pcustomersTag],
    parameters: [
      {
        name: "limit",
        in: "query",
        required: false,
        schema: { type: "string" },
        description:
          "Số các khách hàng tiềm năng có thể lấy về trong một lần yêu cầu.",
      },
      {
        name: "startKey",
        in: "query",
        required: false,
        schema: { type: "string" },
        description: "Chuỗi primary key bắt đầu (được mã hoá thành base64).",
      },
    ],
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { type: "object", properties: pcustomerProperties },
            },
            meta: { type: "object" },
          },
        },
        "Danh sách của khách hàng tiềm năng.",
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
    summary: "Lấy thông tin của một khách hàng tiềm năng.",
    description: "Lấy thông tin của một khách hàng tiềm năng trong hệ thống.",
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
            data: { type: "object", properties: pcustomerProperties },
            meta: { type: "object" },
          },
        },
        "Thông tin của khách hàng tiềm năng.",
      ),
    },
  },
  {
    method: "post",
    path: "/pcustomer",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await addCustomerPipeline.run(ctx);
    },
    summary: "Thêm thông tin khách hàng tiềm năng.",
    description: "Thêm thông tin của một khách hàng tiềm năng vào hệ thống.",
    tags: [pcustomersTag],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: pcustomerToAddProperties },
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: { type: "object", properties: pcustomerProperties },
            meta: { type: "object" },
          },
        },
        "Thông tin mới của khách hàng tiềm năng.",
      ),
    },
  },
  {
    method: "patch",
    path: "/pcustomers/:id",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await updateCustomerPipeline.run(ctx);
    },
    summary: "Chỉnh sửa thông tin của một khách hàng tiềm năng.",
    description:
      "Chỉnh sửa thông tin của một khách hàng tiềm năng có sẵn trong hệ thống.",
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
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", properties: pcustomerToUpdateProperties },
        },
      },
    },
    responses: {
      ...jsonResponse(
        "200",
        {
          type: "object",
          properties: {
            data: { type: "object", properties: pcustomerProperties },
            meta: { type: "object" },
          },
        },
        "Thông tin của khách hàng tiềm năng.",
      ),
    },
  },
  {
    method: "delete",
    path: "/pcustomers/:id",
    handler: async (req, res, next) => {
      const ctx = createContext(req, res, next);
      return await deleteCustomerPipeline.run(ctx);
    },
    summary: "Xoá thông tin của một khách hàng tiềm năng.",
    description: "Xoá thông tin của một khách hàng tiềm năng ra khỏi hệ thống.",
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
        "Thông tin của khách hàng tiềm năng.",
      ),
    },
  },
];
