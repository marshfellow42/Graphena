const express = require("express");
const router = express.Router();
const multer = require("multer");
const { exec } = require("child_process");
const { ObjectId } = require("mongodb");

// Set up multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle PDF to PNG conversion
router.post("/pdf-to-png", upload.single("file"), async (req, res) => {
    // Get the file path of the uploaded PDF file
    const filePath = req.file.path;

    // Call the Python script to convert PDF to PNG
    exec(`python convert-pdf-to-png.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: "Error during PDF to PNG conversion" });
        }

        // Return the result
        res.json({ message: "PDF converted to PNG", data: stdout });
    });
});

// Route to handle MP4 to GIF conversion
router.post("/mp4-to-gif", upload.single("file"), async (req, res) => {
    // Get the file path of the uploaded MP4 file
    const filePath = req.file.path;

    // Call the Python script to convert MP4 to GIF
    exec(`python convert-mp4-to-gif.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: "Error during MP4 to GIF conversion" });
        }

        // Return the result
        res.json({ message: "MP4 converted to GIF", data: stdout });
    });
});

module.exports = router;
