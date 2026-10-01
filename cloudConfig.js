const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
console.log(cloudinary.config());
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUD_API_KEY);
console.log(
  "API_SECRET:",
  process.env.CLOUD_API_SECRET ? "AVAILABLE" : "MISSING"
);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
     format: "jpg"
,
  },
});

module.exports = {
  cloudinary,
  storage,
};
