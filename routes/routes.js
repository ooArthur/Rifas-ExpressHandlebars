const express = require('express');
const router = express.Router();
const cadastroController = require("../controllers/cadastroController");

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

router.post("/cadastro/criar-usuario", cadastroController.createUser);

router.get("/login", (req, res) => {
    res.render("login");
})

module.exports = router;