import mongoose from "mongoose";

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB connected: ${conn.connection.host} 🛜`);
  } catch (error) {
    console.error(`Failed to connect to MongoDB ${error.message}`);
  }
}
