process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! shuttind down! 🤯");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app";
import connectDB from "./config/db";

connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT} ...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJCTION! shutting down ...🤯");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
