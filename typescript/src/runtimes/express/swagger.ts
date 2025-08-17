import path from "path";

import swaggerJSDoc from "swagger-jsdoc";

// Import constants
import { APP_CONSTANTS } from "../../utils/constants";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cognito Example Application with Typescript",
      version: "1.0.0",
      description:
        "Tài liệu API cho Cognito Example Application with Typescript",
    },
    servers: [
      {
        url: `http://${APP_CONSTANTS.HOST}:${APP_CONSTANTS.PORT}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")], // nơi chứa comment swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
