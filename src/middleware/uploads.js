require("dotenv").config();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // The folder in Cloudinary where files will be stored
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// Create the multer instance using the Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
