import dotenv from "dotenv";

dotenv.config();

export const Configs = {
  AWSProfile: process.env.AWS_PROFILE || "default",
  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWSRegion: process.env.AWS_REGION || "ap-southeast-1",
  DynamoDBTableNamePCustomers:
    process.env.DYNAMODB_TABLE_NAME_PCUSTOMERS || "test_table",
};
