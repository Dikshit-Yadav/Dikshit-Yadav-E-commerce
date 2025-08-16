const multer = require('multer');
const sharp = require('sharp');

const upload = multer({ storage: multer.memoryStorage() });

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 400 })
      .jpeg({ quality: 40 })
      .toBuffer();

    req.imageBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    next();
  } catch (err) {
    console.error("Error processing image:", err);
    return res.status(500).send("Image processing error");
  }
};

module.exports = {
  upload,
  processImage
};
