class contactsDAO {
    // métodos para CRUD
    // CREATE
    static async insertData(client, doc) {
        const ok = await client.insertOne(doc);
        try {
            return ok;
        } catch (err) {
            console.log(err);
        }
    }
    // READ
    static async getUsers(client) {
        const cursor = await client
            .find()
            .project({ _id: 0 })
            .sort({ username: 1 });
        try {
            const results = await cursor.toArray();
            return results;
        } catch (err) {
            console.log(err);
        }
    }
    static async getHistory(client) {
        const cursor = await client.find().project({ _id: 0 });
        try {
            const results = await cursor.toArray();
            return results;
        } catch (err) {
            console.log(err);
        }
    }

    static async getUserByUUID(client, id) {
        try {
            const result = await client.findOne(
                { _id: id }, // Query by ObjectId
                { projection: { _id: 0 } } // Exclude _id from the result
            );
            return result;
        } catch (err) {
            console.log("Error in getUserByUUID:", err);
            throw err; // Pass error back to the route handler
        }
    }

    static async updateUserByUUID(client, id, updatedData) {
        try {
            // Remove undefined or empty fields from the update
            const fieldsToUpdate = {};
            for (const key in updatedData) {
                if (updatedData[key]) {
                    fieldsToUpdate[key] = updatedData[key];
                }
            }

            if (Object.keys(fieldsToUpdate).length === 0) {
                throw new Error("No valid fields provided for update.");
            }

            const result = await client.updateOne(
                { _id: new ObjectId(id) }, // Use ObjectId to query by ID
                { $set: fieldsToUpdate }
            );

            if (result.modifiedCount === 0) {
                throw new Error("No user was updated. User may not exist.");
            }

            return { success: true, message: "User updated successfully." };
        } catch (err) {
            console.log("Error in updateUserByUUID:", err);
            throw err;
        }
    }

    static async deleteUserByUUID(client, id) {
        try {
            const result = await client.deleteOne({ _id: id });
            return result;
        } catch (err) {
            console.log("Error in deleteUserByUUID:", err);
            throw err; // Pass error back to the route handler
        }
    }

    static async getHistoryByUUID(client, id) {
        try {
            // Find the history or related data based on the UUID (id)
            const cursor = await client.find({ linked_user: id });

            const results = await cursor.toArray();
            return results;
        } catch (err) {
            console.log("Error in getHistoryFromUUID:", err);
            throw err; // Pass error back to the route handler
        }
    }

    static async deleteOneHistoryByUUID(client, id) {
        try {
            // Delete the document based on the provided UUID (id)
            const result = await client.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                console.log(`No history found with the UUID: ${id}`);
                return null; // or you can throw an error or return a custom message
            }

            return result; // Return the result of the delete operation
        } catch (err) {
            console.log("Error in deleteOneHistoryByUUID:", err);
            throw err; // Pass error back to the route handler
        }
    }
}

module.exports = contactsDAO;