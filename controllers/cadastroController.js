const conn = require('../config/dbConfig');
const bcrypt = require('bcrypt');

module.exports = {
    async createUser(req, res) {
        const nome = req.body.nome;
        const email = req.body.email;
        const senha = req.body.senha;

        try {
            // Gerar hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o custo do hash
            // Insira o usuário no banco de dados com a senha hash
            const sql = `INSERT INTO usuarios (nome, email, senha) VALUES ('${nome}', '${email}', '${hashedPassword}')`;
            conn.query(sql, function (err) {
                if (err) {
                    console.log('Erro: ', err);
                    return;
                }
                res.redirect("/")
            });
        } catch (error) {
            console.log('Erro: ', err);
        }
    }
}