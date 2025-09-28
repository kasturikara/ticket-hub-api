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

const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// swagger
const swaggerDoc = YAML.load(path.join(__dirname, "../doc/openapi.yml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/api", mainRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
