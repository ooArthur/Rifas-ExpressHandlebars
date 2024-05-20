// routes/routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cadastroController = require('../controllers/cadastroController');
const loginController = require('../controllers/loginController');
const dashboardController = require('../controllers/dashboardController');
const conn = require('../config/dbConfig');

const jwt = require('jsonwebtoken');
require('dotenv').config();

function token(req, res) {
    const authHeader = req.headers['authorization'];
    let token;

    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ error: "Acesso negado, token não fornecido" });
    }

    jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }

        console.log(decodedToken.userId);

        req.user = decodedToken;

        return res.status(200).json({ userId: req.user.userId });
    });
}

router.post("/validaToken", (req, res) => {
    token(req, res);
});

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
    const userId = req.query.userId;

    const sql = `SELECT nome FROM usuarios WHERE id = ?`;

    conn.query(sql, [userId], function (error, data) {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao obter usuário');
            return;
        }
        const user = data[0];
        res.render("painel", { user });
    });
});

module.exports = router;