const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.URI;
const client = new MongoClient(uri);

const db = client.db("converter");
const mydb_users = db.collection("usuarios");
const mydb_historico = db.collection("historico");

module.exports = { client, mydb_users, mydb_historico };