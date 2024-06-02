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
    },

    async updateRifa(req, res) {
        const { id } = req.params;
        const { tituloRifa, descricaoRifa, valorBilhete, qtdBilhete, dataTermino } = req.body;
        const userId = req.user.userId;  // Obter o userId do middleware de autenticação
    
        // Verifique se algum campo está vazio
        if (!tituloRifa || !descricaoRifa || !valorBilhete || !qtdBilhete || !dataTermino) {
            return res.status(400).json({ error: "Por favor, preencha todos os campos" });
        }
    
        try {
            // Atualize a rifa no banco de dados
            const sql = `
                UPDATE rifas
                SET nomeRifa = ?, descricao = ?, valorBilhete = ?, numMaxBilhetes = ?, dataTermino = ?
                WHERE id = ? AND userId = ?
            `;
            const [result] = await conn.promise().query(sql, [tituloRifa, descricaoRifa, valorBilhete, qtdBilhete, dataTermino, id, userId]);
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Rifa não encontrada ou você não tem permissão para atualizá-la" });
            }
    
            res.status(200).json({ message: "Rifa atualizada com sucesso" });
        } catch (error) {
            console.error('Erro ao atualizar rifa:', error);
            res.status(500).json({ error: "Erro ao atualizar rifa" });
        }
    },
     
    async deleteRifa(req, res) {
        const { id } = req.params;
        const { userId } = req.query;

        console.log(`Tentando excluir rifa com id: ${id} e userId: ${userId}`);

        if (!userId) {
            return res.status(400).json({ error: "Usuário não autenticado" });
        }

        try {
            // Excluir os bilhetes associados à rifa
            const deleteBilhetesQuery = `
                DELETE FROM bilhetes
                WHERE rifaId = ?
            `;
            await conn.promise().query(deleteBilhetesQuery, [id]);

            // Excluir a rifa
            const deleteRifaQuery = `
                DELETE FROM rifas
                WHERE id = ? AND userId = ?
            `;
            const [result] = await conn.promise().query(deleteRifaQuery, [id, userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Rifa não encontrada ou você não tem permissão para excluí-la" });
            }

            console.log(`Rifa com id: ${id} excluída com sucesso`);

            // Envie uma resposta JSON de sucesso
            return res.status(200).json({ message: "Rifa excluída com sucesso" });
        } catch (error) {
            console.error('Erro ao excluir rifa:', error);
            // Em caso de erro, envie uma resposta JSON com status 500
            return res.status(500).json({ error: "Erro ao excluir rifa, por favor, tente novamente mais tarde" });
        }
    }

};