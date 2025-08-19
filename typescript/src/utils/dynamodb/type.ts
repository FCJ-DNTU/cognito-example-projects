// Import types
import type { Condition, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type TPartitionQuery = {
  name: string;
  value: any;
  condition?: Condition;
};

export type TSortQuery = {
  name: string;
  value: any;
};

export type TBaseDynamoDBCommandParams<TData = unknown> = {
  client?: DynamoDBClient;
  tableName: string;
  indexName?: string;
  partitionQuery: TPartitionQuery;
  sortQuery?: TSortQuery;
  data?: TData;
};
