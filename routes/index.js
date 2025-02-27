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
    // Check if the user is logged in and if linked_user is present in the session
    if (!req.session || !req.session.user || !req.session.user._id) {
        return res.status(401).send("Usuário não vinculado ou não autenticado.");
    }

    try {
        // Filter records by linked_user
        const historico = await mydb_historico.find({ linked_user: req.session.user._id }).toArray();
        
        res.render("auth/history", {
            title: "Histórico",
            history: historico, // Pass the filtered history to the template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar dados do histórico");
    }
});



  router.get("/history/login", function (req, res, next) {
    if (req.session && req.session.user) {
        res.redirect("/history");
    } else {
        res.render("auth/login-history", { title: "Login" });
    }
});


router.get("/profile/login", function (req, res, next) {
    res.render("auth/login-profile", { title: "Login" });
});

router.get("/mp4-para-gif", function (req, res, next) {
    if (req.session && req.session.user) {
        user = true        
    } else {
        user = false
    }
    res.render("convert/mp4-para-gif", { title: "MP4 para GIF", login: user });
});

router.get("/pdf-para-png", function (req, res, next) {
    if (req.session && req.session.user) {
        user = true        
    } else {
        user = false
    }
    res.render("convert/pdf-para-png", { title: "PDF para PNG", login: user });
});

router.get("/create-account", function (req, res, next) {
    res.render("auth/create-account", { title: "Criar conta" });
});

router.get("/logout", function (req, res, next) {
    req.session.destroy();
    res.redirect("/pdf-para-png");
});

module.exports = router;
