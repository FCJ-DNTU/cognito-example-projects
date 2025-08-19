import {
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

// Import errors
import { AppError, ClientError } from "../../../error";

// Import configs from utils
import { Configs } from "../../../../utils/configs";

// Import helpers from utils
import { getDynamoDBClient } from "../../../../utils/aws-clients";
import {
  buildSetUpdateExpression,
  fromDynamoDBItem,
  toDynamoDBItem,
} from "../../../../utils/dynamodb/helpers";
import {
  checkExistanceOrThrowError,
  checkPropInObjOrThrowError,
} from "../../../../utils/helpers/check";
import { urlSafeEncode, urlSafeDecode } from "../../../../utils/crypto/base64";

// Import types
import type {
  DynamoDBClient,
  QueryCommandInput,
  PutItemCommandInput,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
  QueryOutput,
  InternalServerError,
} from "@aws-sdk/client-dynamodb";
import type { TInternalContext } from "../../../context/internal-context";
import type {
  IPCustomerDAO,
  TFindPCustomerParams,
  TFindPCustomerResult,
  TDeletePCustomerParams,
  TPCustomer,
} from "./type";
import { TDeleteByQuery } from "../../../context/data-access-object/type";

export class PCustomerDAO implements IPCustomerDAO {
  private _client!: DynamoDBClient;

  constructor() {
    this._client = getDynamoDBClient({});
  }

  /**
   * Kiểm tra xem các hàm có params hay không.
   *
   * @param ctx - internal context.
   */
  private _checkMethodParams(ctx: TInternalContext) {
    const { params } = ctx;

    checkExistanceOrThrowError(
      params,
      "params",
      "Parameters of findPCustomerByQuery is required",
    );
  }

  /**
   * Kiểm tra params của các method có query.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  private _checkQueryMethodParams(ctx: TInternalContext) {
    const { params } = ctx;

    checkExistanceOrThrowError(
      params,
      "params",
      "Parameters of findPCustomerByQuery is required",
    );

    const { query } = params as any;

    checkExistanceOrThrowError(query, "query", "Query must be in params");
  }

  /**
   * Tạo QueryCommandInput nền cho các phương thức cần.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  private _createBaseQueryCommandInput(
    ctx: TInternalContext<Partial<TFindPCustomerParams>>,
  ) {
    const { indexName, staryKey, limit = "10" } = ctx.params;

    const input: QueryCommandInput = {
      TableName: Configs.DynamoDBTableNamePCustomers,
      IndexName: indexName,
      Limit: parseInt(limit),
    };

    if (staryKey) {
      input["ExclusiveStartKey"] = urlSafeDecode(staryKey) as any;
    }

    if (indexName) {
      input["IndexName"] = indexName;
    }

    return input;
  }

  /**
   * Tạo PutItemCommandInput cho các phương thức cần.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  private _createBasePutItemCommandInput(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ) {
    const currDate = new Date();

    ctx.params.id = currDate.getTime().toString();
    ctx.params.createAt = currDate.toISOString();

    const input: PutItemCommandInput = {
      TableName: Configs.DynamoDBTableNamePCustomers,
      Item: toDynamoDBItem(ctx.params!),
      ReturnValues: "ALL_NEW",
    };

    return input;
  }

  /**
   * Tạo UpdateItemCommandInput nền cho các method cần.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  private _createBaseUpdateItemCommandInput(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ) {
    let { id, createAt, ...updatableData } = ctx.params;
    let { setExpression, expressionAttrValues } =
      buildSetUpdateExpression(updatableData)!;

    const input: UpdateItemCommandInput = {
      TableName: Configs.DynamoDBTableNamePCustomers,
      Key: toDynamoDBItem({
        id,
        createAt,
      }),

      UpdateExpression: setExpression,
      ExpressionAttributeValues: expressionAttrValues,
      ReturnValues: "ALL_NEW",
    };

    return input;
  }

  /**
   * Tạo DeleteItemCommandInput nền cho các method cần.
   *
   * @param ctx - internal context.
   *
   * @returns
   */
  private _createBaseDeleteItemCommandInput(ctx: TInternalContext) {
    const { query } = ctx.params as any;

    const input: DeleteItemCommandInput = {
      TableName: Configs.DynamoDBTableNamePCustomers,
      Key: toDynamoDBItem({
        type: "potential_customer",
        id: query.id,
      }),
    };

    return input;
  }

  /**
   * Tạo response cho query. Sử dụng trong trường hợp query nhiều item.
   *
   * @param response - response từ query command
   */
  private _createQueryResponse(response: QueryOutput) {
    return {
      items: response.Items
        ? response.Items.map((item) => fromDynamoDBItem(item) as TPCustomer)
        : [],
      meta: {
        size: response.Count || 0,
        lastKey: response.LastEvaluatedKey
          ? urlSafeEncode(response.LastEvaluatedKey as any)
          : undefined,
      },
    };
  }

  async listPCustomers(
    ctx: TInternalContext<Partial<TFindPCustomerParams>>,
  ): Promise<TFindPCustomerResult | undefined> {
    try {
      this._checkMethodParams(ctx);

      const input = this._createBaseQueryCommandInput(ctx);

      input["ExpressionAttributeNames"] = {
        "#customerType": "type",
      };
      input["KeyConditionExpression"] =
        "#customerType = :pk AND begins_with(id, :customerIdPrefix)";
      input["ExpressionAttributeValues"] = {
        ":pk": { S: "potential_customer" },
        ":customerIdPrefix": { S: "CUSTOMER#" },
      };

      const command = new QueryCommand(input);
      const response = await this._client.send(command);

      return this._createQueryResponse(response);
    } catch (error: any) {
      console.error("Error - ListPCustomers:", error.message);

      if (ctx.options && ctx.options.canCatchError) {
        throw new AppError(error.message);
      }

      return undefined;
    }
  }

  async getPCustomer(
    ctx: TInternalContext<Partial<TFindPCustomerParams>>,
  ): Promise<TPCustomer | undefined> {
    try {
      this._checkQueryMethodParams(ctx);

      const input = this._createBaseQueryCommandInput(ctx);

      input["ExpressionAttributeNames"] = {
        "#customerType": "type",
      };
      input["KeyConditionExpression"] = "#customerType = :pk AND id = :sk";
      input["ExpressionAttributeValues"] = {
        ":pk": { S: "potential_customer" },
        ":sk": { S: ctx.params.query?.id! },
      };

      const command = new QueryCommand(input);
      const response = await this._client.send(command);

      const items = response.Items;

      if (!items) throw new ClientError("Customer not found");

      return fromDynamoDBItem(items[0]) as TPCustomer;
    } catch (error: any) {
      console.error("Error - ListPCustomers:", error.message);

      if (ctx.options && ctx.options.canCatchError) {
        throw new AppError(error.message);
      }

      return undefined;
    }
  }

  async insertPCustomer(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ): Promise<TPCustomer | undefined> {
    try {
      this._checkMethodParams(ctx);

      const input = this._createBasePutItemCommandInput(ctx);
      const command = new PutItemCommand(input);
      const response = await this._client.send(command);

      console.log("Response - InsertPCustomer:", response);

      return response.Attributes
        ? (fromDynamoDBItem(response.Attributes) as TPCustomer)
        : undefined;
    } catch (error: any) {
      console.error("Error - InsertPCustomer:", error.message);

      if (ctx.options && ctx.options.canCatchError) {
        throw new AppError(error.message);
      }

      return undefined;
    }
  }

  async updatePCustomer(
    ctx: TInternalContext<Partial<TPCustomer>>,
  ): Promise<TPCustomer | undefined> {
    try {
      this._checkMethodParams(ctx);

      const input = this._createBaseUpdateItemCommandInput(ctx);
      const command = new UpdateItemCommand(input);
      const response = await this._client.send(command);

      console.log("Response - UpdatePCustomer:", response);

      return response.Attributes
        ? (fromDynamoDBItem(response.Attributes) as TPCustomer)
        : undefined;
    } catch (error: any) {
      console.error("Error - UpdatePCustomer:", error.message);

      if (ctx.options && ctx.options.canCatchError) {
        throw new AppError(error.message);
      }

      return undefined;
    }
  }

  async deletePCustomer(
    ctx: TInternalContext<TDeletePCustomerParams>,
  ): Promise<boolean> {
    try {
      this._checkQueryMethodParams(ctx);

      const input = this._createBaseDeleteItemCommandInput(ctx);
      const command = new DeleteItemCommand(input);
      const response = await this._client.send(command);

      console.log("Response - DeletePCustomer:", response);

      return true;
    } catch (error: any) {
      console.error("Error - DeletePCustomer:", error.message);

      if (ctx.options && ctx.options.canCatchError) {
        throw new AppError(error.message);
      }

      return false;
    }
  }
}
