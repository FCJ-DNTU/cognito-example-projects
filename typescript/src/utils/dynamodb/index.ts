import {
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

// Import errors
import { ClientError } from "../../core/error";

// Import AWS Clients
import { getDynamoDBClient } from "../aws-clients";

// Import configs
import { Configs } from "../configs";

// Import helpers
import {
  buildSetUpdateExpression,
  fromDynamoDBItem,
  toDynamoDBItem,
} from "./helpers";
import {
  checkEmptyOrThrowError,
  checkExistanceOrThrowError,
  checkPropInObjOrThrowError,
} from "../helpers/check";

// Import types
import type {
  PutItemCommandInput,
  UpdateItemCommandInput,
  QueryCommandInput,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import type { TInternalContext } from "../../core/context/internal-context";
import type { TBaseDynamoDBCommandParams } from "./type";

/**
 * Thêm một item mới vào trong dynamodb table.
 *
 * @param ctx - internal context.
 *
 * @returns
 */
export async function addItem(
  ctx: TInternalContext<Partial<TBaseDynamoDBCommandParams>>,
) {
  try {
    const { params } = ctx;
    let data = params.data;

    if (!params.client) {
      params.client = getDynamoDBClient({});
    }

    // TODO: Validate params
    checkEmptyOrThrowError(
      params.tableName,
      "tableName",
      "Name of table is required to add item",
    );
    checkExistanceOrThrowError(data, "data", "Data is required to add item");

    const putItemParams: PutItemCommandInput = {
      TableName: params.tableName,
      Item: toDynamoDBItem(data as any),
    };

    const command = new PutItemCommand(putItemParams);
    const response = await params.client.send(command);

    console.log("AddItem Response:", response);

    return data;
  } catch (error: any) {
    // Log error to console
    console.error("AddItem Error:", error.message);

    if (ctx.options && ctx.options.canCatchError) {
      throw new ClientError(error.message);
    }

    return;
  }
}

/**
 * Thêm một item mới vào trong dynamodb table.
 *
 * @param ctx - internal context.
 *
 * @returns
 */
export async function updateItem(
  ctx: TInternalContext<Partial<TBaseDynamoDBCommandParams>>,
) {
  try {
    const { params } = ctx;
    let data = params.data;

    if (!params.client) {
      params.client = getDynamoDBClient({});
    }

    // TODO: Validate params
    checkEmptyOrThrowError(
      params.tableName,
      "tableName",
      "Name of table is required to update item",
    );
    checkExistanceOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "Partition Query is required to update item",
    );
    checkPropInObjOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "key",
      "Key in Partition Query is required to update item",
    );
    checkPropInObjOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "value",
      "Value in Partition Query is required to update item",
    );
    checkExistanceOrThrowError(data, "data", "Data is required to update item");

    const key = {
      [params.partitionQuery?.name!]: params.partitionQuery?.value!,
    };

    if (params.sortQuery) {
      checkPropInObjOrThrowError(
        params.sortQuery,
        "sortQuery",
        "key",
        "Key in Sort Query is required to update item",
      );
      checkPropInObjOrThrowError(
        params.sortQuery,
        "sortKey",
        "value",
        "Value in Sort Query is required to update item",
      );

      key[params.sortQuery.name!] = params.sortQuery.value;
    }

    const { setExpression, expressionAttrValues } = buildSetUpdateExpression(
      data as any,
    )!;

    const updateItemParams: UpdateItemCommandInput = {
      TableName: params.tableName,
      Key: toDynamoDBItem(key),
      UpdateExpression: setExpression,
      ExpressionAttributeValues: expressionAttrValues,
      ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(updateItemParams);
    const response = await params.client.send(command);

    console.log("Update Response:", response);

    return fromDynamoDBItem(response.Attributes!);
  } catch (error: any) {
    // Log error to console
    console.error("UpdateItem Error:", error.message);

    if (ctx.options && ctx.options.canCatchError) {
      throw new ClientError(error.message);
    }

    return;
  }
}

/**
 * Thêm một item mới vào trong dynamodb table.
 *
 * @param ctx - internal context.
 *
 * @returns
 */
export async function deleteItem(
  ctx: TInternalContext<Partial<TBaseDynamoDBCommandParams>>,
) {
  try {
    const { params } = ctx;
    let data = params.data;

    if (!params.client) {
      params.client = getDynamoDBClient({});
    }

    // TODO: Validate params
    checkEmptyOrThrowError(
      params.tableName,
      "tableName",
      "Name of table is required to update item",
    );
    checkExistanceOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "Partition Query is required to update item",
    );
    checkPropInObjOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "key",
      "Key in Partition Query is required to update item",
    );
    checkPropInObjOrThrowError(
      params.partitionQuery,
      "partitionQuery",
      "value",
      "Value in Partition Query is required to update item",
    );
    checkExistanceOrThrowError(data, "data", "Data is required to update item");

    const key = {
      [params.partitionQuery?.name!]: params.partitionQuery?.value!,
    };

    if (params.sortQuery) {
      checkPropInObjOrThrowError(
        params.sortQuery,
        "sortQuery",
        "key",
        "Key in Sort Query is required to update item",
      );
      checkPropInObjOrThrowError(
        params.sortQuery,
        "sortKey",
        "value",
        "Value in Sort Query is required to update item",
      );

      key[params.sortQuery.name!] = params.sortQuery.value;
    }

    const deleteItemParams: DeleteItemCommandInput = {
      TableName: params.tableName,
      Key: toDynamoDBItem(key),
    };

    const command = new DeleteItemCommand(deleteItemParams);
    const response = await params.client.send(command);

    console.log("DeleteItem Response:", response);

    return data;
  } catch (error: any) {
    // Log error to console
    console.error("DeleteItem Error:", error.message);

    if (ctx.options && ctx.options.canCatchError) {
      throw new ClientError(error.message);
    }

    return;
  }
}

/**
 * Thêm một item mới vào trong dynamodb table.
 *
 * @param ctx - internal context.
 *
 * @returns
 */
export async function queryItems(
  ctx: TInternalContext<Partial<TBaseDynamoDBCommandParams>>,
) {
  try {
    const { params } = ctx;
    let data = params.data;

    // TODO: Validate params
    checkEmptyOrThrowError(
      params.tableName,
      "tableName",
      "Name of table is required to add item",
    );
    checkExistanceOrThrowError(data, "data", "Data is required to add item");

    if (!params.client) {
      params.client = getDynamoDBClient({});
    }

    const putItemParams: PutItemCommandInput = {
      TableName: params.tableName,
      Item: toDynamoDBItem(data as any),
    };

    const command = new PutItemCommand(putItemParams);
    const response = await params.client.send(command);

    console.log("QueryItem Response:", response);

    return data;
  } catch (error: any) {
    // Log error to console
    console.error("QueryItem Error:", error.message);

    if (ctx.options && ctx.options.canCatchError) {
      throw new ClientError(error.message);
    }

    return;
  }
}

/**
 * Thêm một item mới vào trong dynamodb table.
 *
 * @param ctx - internal context.
 *
 * @returns
 */
export async function queryItem(
  ctx: TInternalContext<Partial<TBaseDynamoDBCommandParams>>,
) {
  try {
    const { params } = ctx;
    let data = params.data;

    // TODO: Validate params
    checkEmptyOrThrowError(
      params.tableName,
      "tableName",
      "Name of table is required to add item",
    );
    checkExistanceOrThrowError(data, "data", "Data is required to add item");

    if (!params.client) {
      params.client = getDynamoDBClient({});
    }

    const putItemParams: PutItemCommandInput = {
      TableName: params.tableName,
      Item: toDynamoDBItem(data as any),
    };

    const command = new PutItemCommand(putItemParams);
    const response = await params.client.send(command);

    console.log("AddItem Response:", response);

    return data;
  } catch (error: any) {
    // Log error to console
    console.error("AddItem Error:", error.message);

    if (ctx.options && ctx.options.canCatchError) {
      throw new ClientError(error.message);
    }

    return;
  }
}
