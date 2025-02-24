const express = require("express");
const router = express.Router();
const multer = require("multer");
const { exec } = require("child_process");
const { ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");

// Set up multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle PDF to PNG conversion
router.post("/pdf-para-png", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;

    // Call the Python script to convert PDF to PNG and zip it
    exec(
        `python convert-pdf-to-png.py ${filePath}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(
                    `Erro na execução do script:\n${error.message}\nStderr: ${stderr}`
                );
                return res.status(500).json({
                    error: "Erro ao executar o script de conversão.",
                    details: {
                        message: error.message,
                        stderr: stderr,
                    },
                });
            }

            // Extract the zip path from the output logs
            const zipFileName = `${path.basename(
                filePath,
                path.extname(filePath)
            )}.zip`;
            const zipPath = path.join(
                process.cwd(),
                "/public/images",
                zipFileName
            );

            // Check if the zip file was created
            if (!fs.existsSync(zipPath)) {
                console.error(`Arquivo ZIP não encontrado em: ${zipPath}`);
                return res.status(500).json({
                    error: "Arquivo ZIP não encontrado após a conversão.",
                    details: {
                        expectedPath: zipPath,
                        stdout: stdout,
                    },
                });
            }

            // Send the zip file for download
            res.download(zipPath, (err) => {
                if (err) {
                    console.error(`Erro ao enviar o arquivo:\n${err.message}`);
                    return res.status(500).json({
                        error: "Erro ao enviar o arquivo ZIP para download.",
                        details: {
                            message: err.message,
                        },
                    });
                }

                console.log(`Arquivo enviado com sucesso: ${zipPath}`);

                // Clean up files after sending
                try {
                    fs.rmSync(filePath); // Delete uploaded PDF
                } catch (cleanupError) {
                    console.error(
                        `Erro ao limpar os arquivos:\n${cleanupError.message}`
                    );
                }
            });
        }
    );
});

// Route to handle MP4 to GIF conversion
router.post("/mp4-para-gif", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;

    // Call the Python script to convert MP4 to GIF
    exec(
        `python convert-mp4-to-gif.py ${filePath}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(
                    `Erro na execução do script:\n${error.message}\nStderr: ${stderr}`
                );
                return res.status(500).json({
                    error: "Erro ao executar o script de conversão.",
                    details: {
                        message: error.message,
                        stderr: stderr,
                    },
                });
            }

            // Extract the GIF path from the output logs
            const gifFileName = `${path.basename(filePath, path.extname(filePath))}.gif`;
            const gifPath = path.join(process.cwd(), "/public/images", gifFileName);

            // Check if the GIF file was created
            if (!fs.existsSync(gifPath)) {
                console.error(`Arquivo GIF não encontrado em: ${gifPath}`);
                return res.status(500).json({
                    error: "Arquivo GIF não encontrado após a conversão.",
                    details: {
                        expectedPath: gifPath,
                        stdout: stdout,
                    },
                });
            }

            // Send the GIF file for download
            res.download(gifPath, (err) => {
                if (err) {
                    console.error(`Erro ao enviar o arquivo:\n${err.message}`);
                    return res.status(500).json({
                        error: "Erro ao enviar o arquivo GIF para download.",
                        details: {
                            message: err.message,
                        },
                    });
                }

                console.log(`Arquivo enviado com sucesso: ${gifPath}`);

                // Clean up files after sending
                try {
                    fs.rmSync(filePath); // Delete uploaded MP4
                } catch (cleanupError) {
                    console.error(
                        `Erro ao limpar os arquivos:\n${cleanupError.message}`
                    );
                }
            });
        }
    );
});


module.exports = router;
