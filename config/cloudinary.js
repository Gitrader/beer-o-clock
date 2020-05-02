const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'm2-project',
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});
 
const parser = multer({ storage: storage });

module.exports = parser;