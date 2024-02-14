import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import exp from "constants";
import path from "path";

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// app.use(express.static(path.join(__dirname,"../../client/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
