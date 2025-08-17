import express from "express";
import swaggerUi from "swagger-ui-express";

// Import constants
import { APP_CONSTANTS } from "../../utils/constants/app.js";

// Import Swagger
import { spec } from "./swagger";
import { registerRoutes } from "./swagger/helpers.js";

// Import routes
import { pcustomersRoutes } from "./routes/pcustomer-management";

const app = express();

// Register routes
registerRoutes(app, pcustomersRoutes, spec);

// Route swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/", (req, res) => {
  return res.json({
    data: { message: "Welcome to Cognito Example Application API" },
  });
});

app.listen(APP_CONSTANTS.PORT, APP_CONSTANTS.HOST, () => {
  const baseUrl = `http://${APP_CONSTANTS.HOST}:${APP_CONSTANTS.PORT}`;

  console.log(`✅ Server chạy tại ${baseUrl}`);
  console.log(`📖 Swagger UI tại ${baseUrl}/api-docs`);
});
