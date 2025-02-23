const express = require("express");
const router = express.Router();
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const { ObjectId } = require("mongodb");

router.get("/user/:uuid", async (req, res) => {
    const uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.deleteUserByUUID(mydb_users, uuid);
    res.json(result);
});

router.get("/history/:uuid", async (req, res) => {
    const media_uuid = new ObjectId(req.params.uuid);
    const result = await contactsDAO.deleteOneHistoryByUUID(
        mydb_historico,
        media_uuid
    );
    res.json(result);
});

module.exports = router;