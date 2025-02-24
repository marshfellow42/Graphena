const express = require("express");
const { mydb_users, mydb_historico } = require("../modules/db");
const contactsDAO = require("../contactsDAO");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    if (req.session.visited) {
        console.log("Welcome back!");
        console.log(req.session);
        console.log(req.session.id);
    } else {
        req.session.visited = true;
        console.log("First visit, session created!");
        console.log(req.session);
        console.log(req.session.id);
    }

    res.render("index", { title: "Conversor de Arquivos" });
});

router.get("/profile/", function (req, res, next) {
    res.render("auth/profile", { title: "Perfil" });
});

router.get("/history", async (req, res, next) => {
    try {
      const historico = await mydb_historico.find({}).toArray();
      res.render("auth/history", {
        title: "Histórico",
        history: historico, // Pass users directly to the template
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao buscar dados do histórico");
    }
  });


router.get("/history/login", function (req, res, next) {
    res.render("auth/login-history", { title: "Login" });
});

router.get("/profile/login", function (req, res, next) {
    res.render("auth/login-profile", { title: "Login" });
});

router.get("/mp4-para-gif", function (req, res, next) {
    res.render("convert/mp4-para-gif", { title: "MP4 para GIF" });
});

router.get("/pdf-para-png", function (req, res, next) {
    res.render("convert/pdf-para-png", { title: "PDF para PNG" });
});

module.exports = router;
