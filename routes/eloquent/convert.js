const express = require("express");
const router = express.Router();
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const axios = require("axios"); // For internal API calls to log history

// Set up multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Helper function to log conversion history
async function logConversionHistory(filename, tipo) {
    try {
        await axios.get(`http://localhost:3000/add/history/${filename}/${tipo}`);
    } catch (error) {
        console.error("Erro ao registrar histórico:", error.message);
    }
}

// PDF to PNG conversion
router.post("/pdf-para-png", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;

    exec(`python convert-pdf-to-png.py ${filePath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro:\n${error.message}\nStderr: ${stderr}`);
            return res.status(500).json({ error: "Erro ao executar o script de conversão." });
        }

        const zipFileName = `${path.basename(filePath, path.extname(filePath))}.zip`;
        const zipPath = path.join(process.cwd(), "/public/images", zipFileName);

        if (!fs.existsSync(zipPath)) {
            return res.status(500).json({ error: "Arquivo ZIP não encontrado após a conversão." });
        }

        res.download(zipPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao enviar o arquivo ZIP." });
            }

            console.log(`Arquivo enviado com sucesso: ${zipPath}`);

            // Log history
            await logConversionHistory(zipFileName, "pdf-para-png");

            try {
                fs.rmSync(filePath); // Clean up uploaded file
            } catch (cleanupError) {
                console.error(`Erro ao limpar arquivos: ${cleanupError.message}`);
            }
        });
    });
});

// MP4 to GIF conversion
router.post("/mp4-para-gif", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;

    exec(`python convert-mp4-to-gif.py ${filePath}`, async (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: "Erro ao executar o script de conversão." });
        }

        const gifFileName = `${path.basename(filePath, path.extname(filePath))}.gif`;
        const gifPath = path.join(process.cwd(), "/public/images", gifFileName);

        if (!fs.existsSync(gifPath)) {
            return res.status(500).json({ error: "Arquivo GIF não encontrado após a conversão." });
        }

        res.download(gifPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao enviar o arquivo GIF." });
            }

            console.log(`Arquivo enviado com sucesso: ${gifPath}`);

            // Log history
            await logConversionHistory(gifFileName, "mp4-para-gif");

            try {
                fs.rmSync(filePath); // Clean up uploaded file
            } catch (cleanupError) {
                console.error(`Erro ao limpar arquivos: ${cleanupError.message}`);
            }
        });
    });
});

module.exports = router;
