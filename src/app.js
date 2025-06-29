import "dotenv/config";
import express from "express";
import morgan from "morgan";

import generalRouter from "./routes/generalRoutes.js";
import mathRouter from "./routes/mathRoutes.js";

const app = express();
app.use(morgan("dev"));

app.use("/api/v1/questions/general", generalRouter);
app.use("/api/v1/questions/math", mathRouter);

export default app;
