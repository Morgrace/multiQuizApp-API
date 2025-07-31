import app from "./app";
import connectDB from "./config/db";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT: ${process.env.PORT} ...`);
});
