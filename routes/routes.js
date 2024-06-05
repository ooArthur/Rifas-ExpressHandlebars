const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cadastroController = require('../controllers/cadastroController');
const loginController = require('../controllers/loginController');
const rifaController = require('../controllers/rifaController');
const bilheteController = require('../controllers/bilheteController');


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

        // Query para contar o número de rifas ativas criadas pelo usuário
        const queryCountRifasAtivas = `SELECT COUNT(*) AS numRifasAtivas FROM rifas WHERE userId = ? AND dataTermino >= CURDATE()`;

        // Query para calcular a arrecadação total considerando apenas as rifas ativas
        const queryTotalArrecadado = `
            SELECT SUM(r.valorBilhete * b.numBilhetesVendidos) AS totalArrecadado
            FROM rifas r
            LEFT JOIN (
                SELECT rifaId, COUNT(*) AS numBilhetesVendidos
                FROM bilhetes
                GROUP BY rifaId
            ) b ON r.id = b.rifaId
            WHERE r.userId = ? AND r.dataTermino >= CURDATE()
        `;

        // Query para listar as rifas ativas e contar os números vendidos
        const queryRifasAtivas = `
            SELECT r.*, COALESCE(COUNT(b.id), 0) AS numBilhetesVendidos
            FROM rifas r
            LEFT JOIN bilhetes b ON r.id = b.rifaId
            WHERE r.userId = ? AND r.dataTermino >= CURDATE()
            GROUP BY r.id
        `;

        // Query para listar as rifas finalizadas
        const queryRifasFinalizadas = `
            SELECT r.*, COALESCE(COUNT(b.id), 0) AS numBilhetesVendidos
            FROM rifas r
            LEFT JOIN bilhetes b ON r.id = b.rifaId
            WHERE r.userId = ? AND r.dataTermino < CURDATE()
            GROUP BY r.id
        `;

        // Executa as queries
        conn.query(queryCountRifasAtivas, [userId], (err, resultsRifasAtivas) => {
            if (err) {
                console.error('Erro ao contar rifas ativas:', err);
                return res.status(500).send('Erro ao obter dados do painel');
            }

            const numRifasAtivas = resultsRifasAtivas[0].numRifasAtivas || 0;

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

                        res.render('painel', { user, numRifas: numRifasAtivas, totalArrecadado: totalArrecadadoFormatado, rifasAtivas, rifasFinalizadas });
                    });
                });
            });
        });
    });
});

router.get("/criarRifa", (req, res) => {
    res.render("criaRifa")
})
router.post("/criarRifa/create", authenticateToken, rifaController.createRifa);

router.get("/detalhes/:id", (req, res) => {
    const rifaId = req.params.id;

    const queryRifaDetalhes = `
        SELECT r.*, COUNT(b.id) AS numBilhetesVendidos 
        FROM rifas r
        LEFT JOIN bilhetes b ON r.id = b.rifaId
        WHERE r.id = ?
        GROUP BY r.id
    `;

    const queryBilhetesVendidos = `
        SELECT numeroBilhete, compradorNome 
        FROM bilhetes 
        WHERE rifaId = ? 
        ORDER BY numeroBilhete ASC
    `;

    conn.query(queryRifaDetalhes, [rifaId], (err, results) => {
        if (err) {
            console.error('Erro ao obter detalhes da rifa:', err);
            return res.status(500).send('Erro ao obter detalhes da rifa');
        }

        if (results.length === 0) {
            return res.status(404).send('Rifa não encontrada.');
        }

        const rifa = results[0];
        rifa.dataInicio = moment(rifa.dataInicio).format('DD/MM/YYYY');
        rifa.dataTermino = moment(rifa.dataTermino).format('DD/MM/YYYY');

        conn.query(queryBilhetesVendidos, [rifaId], (err, bilhetes) => {
            if (err) {
                console.error('Erro ao obter bilhetes vendidos:', err);
                return res.status(500).send('Erro ao obter bilhetes vendidos');
            }

            res.render('rifasDetalhes', { rifa, bilhetes });
        });
    });
});

router.post("/delete/:id", authenticateToken, rifaController.deleteRifa);

router.get("/editarRifa/:id", (req, res) => {
    const rifaId = req.params.id;

    const queryRifaDetalhes = `
        SELECT r.*
        FROM rifas r
        WHERE r.id = ?
    `;

    conn.query(queryRifaDetalhes, [rifaId], (err, results) => {
        if (err) {
            console.error('Erro ao obter detalhes da rifa:', err);
            return res.status(500).send('Erro ao obter detalhes da rifa');
        }

        if (results.length === 0) {
            return res.status(404).send('Rifa não encontrada.');
        }

        const rifa = results[0];
        rifa.dataInicio = moment(rifa.dataInicio).format('DD/MM/YYYY');
        rifa.dataTermino = moment(rifa.dataTermino).format('DD/MM/YYYY');

        res.render('editarRifa', { rifa });
    });
});
router.post("/editarRifa/edit/:id", authenticateToken, rifaController.updateRifa);

router.get("/cadastrarBilhete/:rifaId/:bilheteNum", (req, res) => {
    const rifaId = req.params.rifaId;
    const bilheteNum = req.params.bilheteNum;
    
    res.render("cadastrarBilhete", { rifaId, bilheteNum });
});
router.post("/cadastrarBilhete", authenticateToken, bilheteController.cadastrarBilhete);

module.exports = router;