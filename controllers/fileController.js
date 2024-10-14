const Student = require("../models/student");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// File upload API
const uploadFile = async (req, res) => {
  try {
    let user_id = req.headers["user_id"];
    const student = await Student.findById({ _id: user_id });
    student.files.push(req.file.path);
    await student.save();
    res.json({ message: "File uploaded", path: req.file.path });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error during file upload", error: err.message });
  }
};

// File read API
const readFile = async (req, res) => {
  try {
    let user_id = req.headers["user_id"];
    const student = await Student.findById({ _id: user_id });
    if (student && student.files) {
      res.json({ filePath: student.files });
    } else {
      res.status(404).json({ message: "No profile picture found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// File delete with better error handling
const deleteFile = async (req, res) => {
  const { filePath } = req.body; // Expecting the file path to be sent in the request body
  const user_id = req.headers["user_id"];

  // Validate inputs
  if (!filePath) {
    return res.status(400).json({ message: "File path is required" });
  }

  try {
    // Find the student by user_id
    const student = await Student.findById(user_id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the file path exists in the student's files
    if (!student.files.includes(filePath)) {
      return res
        .status(404)
        .json({ message: "File not found in student's files" });
    }

    // Remove the file path from the files array
    student.files = student.files.filter((path) => path !== filePath);

    // Save the updated student document
    await student.save();

    // Respond with success
    return res.status(204).send(); // No content to return
  } catch (error) {
    console.error("Error deleting file:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the file" });
  }
};

module.exports = { upload, uploadFile, readFile, deleteFile };
