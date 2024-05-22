const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cadastroController = require('../controllers/cadastroController');
const loginController = require('../controllers/loginController');
const conn = require('../config/dbConfig');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const moment = require('moment'); 

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

        // Query para contar o número de rifas criadas pelo usuário
        const queryCountRifas = `SELECT COUNT(*) AS numRifas FROM rifas WHERE userId = ?`;

        // Query para calcular a arrecadação total
        const queryTotalArrecadado = `
            SELECT SUM(valorBilhete) AS totalArrecadado
            FROM bilhetes
            JOIN rifas ON bilhetes.rifaId = rifas.id
            WHERE rifas.userId = ?
        `;

        // Query para listar as rifas ativas e contar os números vendidos
        const queryRifasAtivas = `
            SELECT r.*, COUNT(b.id) AS numBilhetesVendidos
            FROM rifas r
            LEFT JOIN bilhetes b ON r.id = b.rifaId
            WHERE r.userId = ? AND r.dataTermino > NOW()
            GROUP BY r.id
        `;

        // Query para listar as rifas finalizadas
        const queryRifasFinalizadas = `
            SELECT r.*, COUNT(b.id) AS numBilhetesVendidos
            FROM rifas r
            LEFT JOIN bilhetes b ON r.id = b.rifaId
            WHERE r.userId = ? AND r.dataTermino <= NOW()
            GROUP BY r.id
        `;

        // Executa as queries
        conn.query(queryCountRifas, [userId], (err, resultsRifas) => {
            if (err) {
                console.error('Erro ao contar rifas:', err);
                return res.status(500).send('Erro ao obter dados do painel');
            }

            const numRifas = resultsRifas[0].numRifas || 0;

            conn.query(queryTotalArrecadado, [userId], (err, resultsArrecadacao) => {
                if (err) {
                    console.error('Erro ao calcular arrecadação:', err);
                    return res.status(500).send('Erro ao obter dados do painel');
                }

                const totalArrecadado = parseFloat(resultsArrecadacao[0].totalArrecadado) || 0;
                const totalArrecadadoFormatado = totalArrecadado.toFixed(2);

                // Consulta para listar as rifas ativas
                conn.query(queryRifasAtivas, [userId], (err, resultsRifasAtivas) => {
                    if (err) {
                        console.error('Erro ao obter rifas ativas:', err);
                        return res.status(500).send('Erro ao obter dados do painel');
                    }

                    // Formata as datas das rifas ativas
                    const rifasAtivas = resultsRifasAtivas.map(rifa => {
                        return {
                            ...rifa,
                            dataInicio: moment(rifa.dataInicio).format('DD/MM/YYYY'),
                            dataTermino: moment(rifa.dataTermino).format('DD/MM/YYYY')
                        };
                    });

                    // Consulta para listar as rifas finalizadas
                    conn.query(queryRifasFinalizadas, [userId], (err, resultsRifasFinalizadas) => {
                        if (err) {
                            console.error('Erro ao obter rifas finalizadas:', err);
                            return res.status(500).send('Erro ao obter dados do painel');
                        }

                        // Formata as datas das rifas finalizadas
                        const rifasFinalizadas = resultsRifasFinalizadas.map(rifa => {
                            return {
                                ...rifa,
                                dataInicio: moment(rifa.dataInicio).format('DD/MM/YYYY'),
                                dataTermino: moment(rifa.dataTermino).format('DD/MM/YYYY')
                            };
                        });

                        res.render('painel', { user, numRifas, totalArrecadado: totalArrecadadoFormatado, rifasAtivas, rifasFinalizadas });
                    });
                });
            });
        });
    });
});

module.exports = router;