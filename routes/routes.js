// routes/routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cadastroController = require('../controllers/cadastroController');
const loginController = require('../controllers/loginController');

const jwt = require('jsonwebtoken');
require('dotenv').config();

function token(req, res){
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

        // Verifica se o token fornecido é igual ao token gerado
        // const generatedToken = jwt.sign({ userId: decodedToken.userId }, process.env.JWTSECRET, { expiresIn: '1h' });

        console.log(token);
        // console.log(generatedToken);

        /* if (token !== generatedToken) {
            return res.status(403).json({ error: "Token inválido" });
        } */

        // Adiciona as informações do usuário na requisição
        req.user = decodedToken;

        return res.status(200);
    });
}

router.post("/validaToken", (req, res) => {
    token();
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
    res.render("painel");
});


module.exports = router;