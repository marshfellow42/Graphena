const express = require("express");
const router = express.Router(); // You already created the router here
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb_users = client.db("converter").collection("usuarios");
const mydb_historico = client.db("converter").collection("historico");
const contactsDAO = require("./contactsDAO");

app.use(express.json()); // Don't forget to parse JSON requests

// You define your routes with router here, not app directly
router.get("/all/users", async (req, res) => {
    const user_array = await contactsDAO.getUsers(mydb_users);
    res.json(JSON.parse(JSON.stringify(user_array, null, 2)));
});

router.get("/all/history", async (req, res) => {
    const history_array = await contactsDAO.getHistory(mydb_historico);
    res.json(JSON.parse(JSON.stringify(history_array, null, 2)));
});

router.get("/read/user/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.getUserByUUID(mydb_users, uuid);
    res.json(result);
});

router.get("/read/history/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.getHistoryByUUID(mydb_historico, uuid);
    res.json(result);
});

router.get("/add/user/:username/:email/:senha", async (req, res) => {
    const doc = {
        username: req.params.username,
        email: req.params.email,
        senha: req.params.senha,
    };
    const result = await contactsDAO.insertData(mydb_users, doc);
    res.json(result);
});

router.get("/add/history/:uuid/:filename/:tipo", async (req, res) => {
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

router.get("/del/user/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.deleteUserByUUID(mydb_users, uuid);
    res.json(result);
});

router.get("/del/history/:uuid", async (req, res) => {
    const media_uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.deleteOneHistoryByUUID(mydb_historico, media_uuid);
    res.json(result);
});

router.get("/update/user/:id/:username?/:email?/:senha?", async (req, res) => {
    try {
        const { id, username, email, senha } = req.params;
        const updatedData = {
            username: username || undefined,
            email: email || undefined,
            password: senha || undefined,
        };

        const result = await contactsDAO.updateUserByUUID(
            mydb_users,
            id,
            updatedData
        );
        res.json(result);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update user.",
        });
    }
});

// Use the router for all routes
app.use(router); // This is where you connect your router to app

// Start the server
app.listen(process.env.PORT, () => {
    console.log("Servidor rodando...");
});

module.exports = router;