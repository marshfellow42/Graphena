const express = require("express");
const router = express.Router();
const { mydb_users } = require("../../modules/db");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

// History route
router.post("/history", async (req, res) => {
    const { username, password } = req.body;
    console.log("username: " + username)
    console.log("password: " + password)

    try {
        const user = await mydb_users.findOne({ username });
        if (user && (await argon2.verify(user.senha, password))) {
            req.session.user = user;
            return res.redirect("/history");
        } else {
            return res.status(401).send("Credenciais inválidas");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Erro no servidor");
    }
});

// Profile route
router.post("/profile", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await mydb_users.findOne({ username });
        if (user && (await argon2.verify(user.passwordHash, password))) {
            req.session.user = user;
            return res.redirect("/profile");
        } else {
            return res.status(401).send("Credenciais inválidas");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Erro no servidor");
    }
});

// Update route (placeholder)
router.post("/update", async (req, res) => {
    return res.redirect("/");
});

module.exports = router;
