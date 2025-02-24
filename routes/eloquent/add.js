const express = require("express");
const router = express.Router();
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

router.get("/user/:username/:email/:senha", async (req, res) => {
    const doc = {
        username: req.params.username,
        email: req.params.email,
        senha: await argon2.hash(req.params.senha),
    };
    const result = await contactsDAO.insertData(mydb_users, doc);
    res.json(result);
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

router.get("/history/:filename/:tipo", async (req, res) => {
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
        timestamp: now.toISOString().slice(0, 19),
        tipo: req.params.tipo,
    };
    const result = await contactsDAO.insertData(mydb_historico, doc);
    res.json(result);
});

module.exports = router;
