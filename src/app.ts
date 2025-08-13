import "dotenv/config";
import express from "express";
import morgan from "morgan";

import globalErrorHandler from "./middleware/globalErrorhandler.js";
import multiOptionRouter from "./routes/multiOptionRoutes.js";
import trueFalseQuestionRouter from "./routes/trueFalseQuestionRoutes.js";
import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";

const app = express();
app.use(express.json());

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined!");
}
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
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
