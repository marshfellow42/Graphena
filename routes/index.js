var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Conversor de Arquivos' });
});

router.get("/profile/", function (req, res, next) {
  res.render("auth/profile", { title: "Perfil" });
});

router.get("/history/", function (req, res, next) {
  res.render("auth/history", { title: "Histórico", users });
});

router.get('/history/login', function(req, res, next) {
  res.render('auth/login-history', { title: 'Login' });
});

router.get('/profile/login', function(req, res, next) {
  res.render('auth/login-profile', { title: 'Login' });
});

router.get('/mp4-para-gif', function(req, res, next) {
  res.render('convert/mp4-para-gif', { title: 'MP4 para GIF' });
});

router.get('/pdf-para-png', function(req, res, next) {
  res.render('convert/pdf-para-png', { title: 'PDF para PNG' });
});

module.exports = router;
