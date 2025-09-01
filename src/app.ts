import compression from "compression";
import "dotenv/config";
import express from "express";
import mongoSanitize from "@exortek/express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";

import globalErrorHandler from "./middleware/globalErrorHandler.middleware.js";
import { globalLimiter } from "./middleware/rateLimit.middleware.js";
import multiOptionRouter from "./routes/multiOptionRoutes.js";
import trueFalseQuestionRouter from "./routes/trueFalseQuestionRoutes.js";
import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import hpp from "hpp";

const app = express();

//Trust proxy (Important for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

app.set("query parser", "extended");

app.use(express.json({ limit: "10kb" }));

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined!");
}
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//secuirty Http headers
app.use(helmet());

//compression
app.use(compression());

//sanitization against NOSQL query injection
app.use(mongoSanitize());

//sanitizaiton against NOSQL query injection
app.use(mongoSanitize({}));

//sanitization against xss
app.use(xss());

//prevent http parameter pollution
app.use(hpp());

//limit request from same api
app.use("/api", globalLimiter);

//multiOptions Routes
app.use("/api/v1/questions/multi", multiOptionRouter);

//trueFalseQuestions Routes
app.use("/api/v1/questions/trueFalse", trueFalseQuestionRouter);

//user Routes
app.use("/api/v1/users", userRouter);

//handing undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handler
app.use(globalErrorHandler);

export default app;
