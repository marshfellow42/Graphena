const express = require("express");
const router = express.Router();
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

router.post("/user", async (req, res) => {
    const { username, email, password } = req.body;

    // Create the document similar to the GET route
    const doc = {
        username: username,
        email: email,
        senha: await argon2.hash(password), // Hash the password like you did in the GET route
    };

    try {
        // Insert the data into the database
        const result = await contactsDAO.insertData(mydb_users, doc);
        return res.redirect("/pdf-para-png");  // Redirect as per your logic
    } catch (err) {
        console.error(err);
        return res.status(500).send("Erro no servidor");
    }
});

/*
router.get("/history/:uuid/:filename/:tipo", async (req, res) => {
    const now = new Date();
    const formattedDate =
        now.getUTCFullYear() +
        String(now.getUTCMonth() + 1).padStart(2, "0") +
        String(now.getUTCDate()).padStart(2, "0") +
        String(now.getUTCHours()).padStart(2, "0") +
        String(now.getUTCMinutes()).padStart(2, "0") +
        String(now.getUTCSeconds()).padStart(2, "0");

    const doc = {
        linked_user: new ObjectId(req.params.uuid),
        filename: formattedDate + " - " + req.params.filename,
        timestamp: now.toISOString().slice(0, 19),
        tipo: req.params.tipo,
    };
    const result = await contactsDAO.insertData(mydb_historico, doc);
    res.json(result);
});
*/

router.get("/history/:linked_user/:filename/:tipo", async (req, res) => {
    const now = new Date();
    const formattedDate =
        now.getUTCFullYear() +
        String(now.getUTCMonth() + 1).padStart(2, "0") +
        String(now.getUTCDate()).padStart(2, "0") +
        String(now.getUTCHours()).padStart(2, "0") +
        String(now.getUTCMinutes()).padStart(2, "0") +
        String(now.getUTCSeconds()).padStart(2, "0");

    const doc = {
        filename: req.params.filename,
        linked_user: req.params.linked_user,
        timestamp: now.toISOString().slice(0, 19),
        tipo: req.params.tipo,
    };
    const result = await contactsDAO.insertData(mydb_historico, doc);
    res.json(result);
});

module.exports = router;
