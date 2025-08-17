import dotenv from "dotenv";

dotenv.config();

export const APP_CONSTANTS = {
  HOST: process.env.HOST || "localhost",
  PORT: parseInt(process.env.PORT || "7800"),
};
