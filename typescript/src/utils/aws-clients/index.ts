import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Import configs
import { Configs } from "../configs";

// Import types
import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

/**
 * Cấu hình và lấy DynamoBD Client.
 *
 * @param configs - cấu hình của DynamoDBClient.
 *
 * @returns
 */
export function getDynamoDBClient(configs: Partial<DynamoDBClientConfig>) {
  if (!configs.profile) configs.profile = Configs.AWSProfile;
  if (!configs.region) configs.region = Configs.AWSRegion;

  return new DynamoDBClient(configs);
}

/**
 * Cấu hình và lấy Cognito Identity Provider Client.
 *
 * @param configs - cấu hình của CognitoIdentityProviderClient.
 *
 * @returns
 */
export function getCognitoIDProviderClient(
  configs: Partial<CognitoIdentityProviderClientConfig>,
) {
  if (!configs.profile) configs.profile = Configs.AWSProfile;
  if (!configs.region) configs.region = Configs.AWSRegion;

  return new CognitoIdentityProviderClient(configs);
}
