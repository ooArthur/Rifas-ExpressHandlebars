const conn = require('../config/dbConfig');

module.exports = {
    async createRifa(req, res) {
        const { tituloRifa, descricaoRifa, valorBilhete, qtdBilhete, dataTermino } = req.body;
        const { userId } = req.query;

        // Verifique se algum campo está vazio
        if (!tituloRifa || !descricaoRifa || !valorBilhete || !qtdBilhete || !dataTermino) {
            return res.status(400).json({ error: "Por favor, preencha todos os campos" });
        }

        // Verifique se o userId está presente
        if (!userId) {
            return res.status(400).json({ error: "Usuário não autenticado" });
        }

        try {
            // Insira a rifa no banco de dados
            const sql = `
                INSERT INTO rifas (userId, nomeRifa, descricao, valorBilhete, numMaxBilhetes, dataTermino)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await conn.promise().query(sql, [userId, tituloRifa, descricaoRifa, valorBilhete, qtdBilhete, dataTermino]);

            res.status(201).json({ message: "Rifa criada com sucesso" });
        } catch (error) {
            console.error('Erro ao criar rifa:', error);
            res.status(500).json({ error: "Erro ao criar rifa" });
        }
    }
};