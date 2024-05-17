// routes/routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cadastroController = require('../controllers/cadastroController');
const loginController = require('../controllers/loginController');

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/cadastro", (req, res) => {
    res.render("cadastro");
});
router.post("/cadastro/criar-usuario", cadastroController.createUser);

router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login/authUser", loginController.login);


router.get("/painel", (req, res) => {
    res.render("painel");
});

module.exports = router;
