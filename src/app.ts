import { config } from "dotenv";
config();

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import mainRoutes from "./routes";
import { errorHandler, logger } from "./utils/error";

const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// swagger
const swaggerDoc = YAML.load(path.join(__dirname, "../docs/openapi.yml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/api", mainRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
});

// handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});

export default app;
