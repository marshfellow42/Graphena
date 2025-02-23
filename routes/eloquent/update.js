const express = require("express");
const router = express.Router();
const { mydb_users, mydb_historico } = require("../../modules/db");
const contactsDAO = require("../../contactsDAO");
const { ObjectId } = require("mongodb");

router.get("/update/user/:id/:username?/:email?/:senha?", async (req, res) => {
    try {
        const { id, username, email, senha } = req.params;

        // Build the update object dynamically
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

module.exports = router;