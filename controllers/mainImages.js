const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path');
const uploadDir = '../public' // Adjust based on your structure
async function uploadMainImage(req, res) {

    try {
    if (!req.files?.uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedFile = req.files.uploadedFile;
    const filePath = path.join(uploadDir, uploadedFile.name);

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