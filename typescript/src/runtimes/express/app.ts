import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

// Import constants
import { APP_CONSTANTS } from "../../utils/constants/app.js";

// Import Swagger
import { swaggerDoc } from "../../core/docs/swagger/index.js";
import { registerRoutes } from "../../core/docs/swagger/helpers.js";

// Import routes
import { authRoutes } from "./routes/auth/index.js";
import { pcustomersRoutes } from "./routes/pcustomer-management";

const app = express();

// Add global middlewares
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
registerRoutes(app, authRoutes, swaggerDoc);
registerRoutes(app, pcustomersRoutes, swaggerDoc);

// Route swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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
