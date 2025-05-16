const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path');
const __dirname = path.dirname(__filename);
const uploadDir = '../../../client/public'
async function uploadMainImage(req, res) {

    try {
    if (!req.files?.uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const publicPath = path.join(__dirname, uploadDir);
    const uploadedFile = req.files.uploadedFile;
    const filePath = path.join(publicPath, uploadedFile.name);

    await uploadedFile.mv(filePath);
    
    res.status(200).json({
      message: "File uploaded successfully",
      fileName: uploadedFile.name,
      filePath: `/${uploadedFile.name}`
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "File upload failed",
      error: error.message 
    });
  }
  }

  module.exports = {
    uploadMainImage
};