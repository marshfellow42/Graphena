const express = require("express");
const router = express.Router();
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const { ObjectId } = require("mongodb");

router.get("/users", async (req, res) => {
    const users = await contactsDAO.getUsers(mydb_users);
    res.json(users);
});

router.get("/history", async (req, res) => {
    const history = await contactsDAO.getHistory(mydb_historico);
    res.json(history);
});

router.get("/user/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const user = await contactsDAO.getUserByUUID(mydb_users, uuid);
    res.json(user);
});

router.get("/history/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.getHistoryByUUID(mydb_historico, uuid);
    res.json(result);
});

module.exports = router;
