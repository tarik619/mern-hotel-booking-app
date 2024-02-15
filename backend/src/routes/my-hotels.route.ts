import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel.model";
import verifyToken from "../middleware/auth.middleware";
import { body } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("type").notEmpty().withMessage("type is required"),

    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("pricePerNight is required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("facilities is required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // upload the image in cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      // if upload was success, add the urls to the new hotel
      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId as string;

      // save the new hotel to the database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      // return the new hotel
      res.status(201).json({ hotel });
    } catch (error) {
      console.log("error creating hotel", error);
      res.status(500).json({ message: "Error creating hotel" });
    }
  }
);

export default router;
