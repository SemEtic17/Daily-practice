import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:5173", // Change to match your frontend URL
    credentials: true, // Allows sending cookies (if using refresh tokens)
  })
);
const dbString = process.env.MONGO_URI.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);

mongoose.connect(dbString);
const DB = mongoose.connection;

DB.on("error", (err) => {
  console.log(err);
}).once("open", () => {
  console.log("MongoDb is connected");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
