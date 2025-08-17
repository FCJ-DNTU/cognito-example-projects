import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

// Import constants
import { APP_CONSTANTS } from "../../utils/constants/app.js";

// Import routers
import PotentialCustomersRouter from "./routes/pcustomer-management";

const app = express();

// Route swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route API
app.use(PotentialCustomersRouter);

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
