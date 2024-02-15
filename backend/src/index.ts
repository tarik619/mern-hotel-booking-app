import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import myHotelRoutes from "./routes/my-hotels.route";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// render build command: cd frontend && npm install && npm run build && cd ../backend && npm run build

// start command: cd backend && npm start

// app.use(express.static(path.join(__dirname,"../../client/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
