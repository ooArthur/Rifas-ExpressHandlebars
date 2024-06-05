const conn = require('../config/dbConfig');

module.exports = {
    async cadastrarBilhete(req, res) {
        const { rifaId, bilheteNum, compradorNome } = req.body;
        const userId = req.user.userId; // ID do usuário autenticado

        // Consulta para obter o ID do usuário que criou a rifa
        const queryGetRifaUserId = 'SELECT userId, numMaxBilhetes FROM rifas WHERE id = ?';
        conn.query(queryGetRifaUserId, [rifaId], (err, results) => {
            if (err) {
                console.error('Erro ao obter o ID do usuário da rifa:', err);
                return res.status(500).json({ error: 'Erro ao verificar a propriedade da rifa' });
            }

            // Verifique se a rifa existe e se o ID do usuário autenticado é o mesmo que criou a rifa
            if (results.length === 0 || results[0].userId !== userId) {
                return res.status(403).json({ error: 'Você não tem permissão para cadastrar um bilhete nesta rifa' });
            }

            // Verifique se o número do bilhete é válido
            const numMaxBilhetes = results[0].numMaxBilhetes;
            if (bilheteNum > numMaxBilhetes || bilheteNum < 1) {
                return res.status(400).json({ error: 'Número do bilhete inválido' });
            }

            // Verifique se o bilhete ainda está disponível e insira-o no banco de dados
            const queryCheckBilhete = 'SELECT * FROM bilhetes WHERE rifaId = ? AND numeroBilhete = ?';
            conn.query(queryCheckBilhete, [rifaId, bilheteNum], (err, results) => {
                if (err) {
                    console.error('Erro ao verificar bilhete:', err);
                    return res.status(500).json({ error: 'Erro ao verificar bilhete' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'Bilhete já cadastrado' });
                }

                // Insira o bilhete comprado no banco de dados
                const queryInsertBilhete = 'INSERT INTO bilhetes (rifaId, numeroBilhete, compradorNome) VALUES (?, ?, ?)';
                conn.query(queryInsertBilhete, [rifaId, bilheteNum, compradorNome], (err, results) => {
                    if (err) {
                        console.error('Erro ao cadastrar bilhete:', err);
                        return res.status(500).json({ error: 'Erro ao cadastrar bilhete' });
                    }

                    res.status(200).json({ message: 'Cadastro de bilhete realizado com sucesso!' });
                });
            });
        });
    }
};