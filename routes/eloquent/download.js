const express = require("express");
const router = express.Router();
const path = require("path"); // ✅ Import path module
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

router.get("/history/:filename", async (req, res) => {
    const filePath = req.params.filename;

    // ✅ Generate ZIP filename directly
    const zipFileName = `${filePath}`;
    const zipPath = path.join(process.cwd(), "/public/images", zipFileName);
    console.log(zipPath)

    // ✅ Simplified download with error handling
    res.download(zipPath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao enviar o arquivo ZIP." });
        }

        console.log(`Arquivo enviado com sucesso: ${zipPath}`);
    });
});

module.exports = router;
