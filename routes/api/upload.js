const express = require("express");
const multer = require("multer");
const authMiddleware = require("../../middlewares/authMiddleware");
const fileController = require("../../controllers/fileController");

const router = express.Router();
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Set the destination to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// Upload file
router.post(
  "/upload",
  authMiddleware,
  upload.single("profilePicture"),
  fileController.uploadFile
);

// Delete file
router.delete("/deletefile", authMiddleware, fileController.deleteFile);

// Read file
router.get("/getfiles", authMiddleware, fileController.readFile);

module.exports = router;
