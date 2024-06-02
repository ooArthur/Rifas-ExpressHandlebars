const conn = require('../config/dbConfig');
const bcrypt = require('bcrypt');
module.exports = {
    async createUser(req, res) {
        const { nome, email, senha, confirmSenha } = req.body;

        // Verifique se algum campo está vazio
        if (!nome || !email || !senha || !confirmSenha) {
            return res.status(400).json({ error: "Por favor, preencha todos os campos" });
        }

        if (senha !== confirmSenha) {
            return res.status(400).json({ error: "As senhas não coincidem" });
        }

        try {
            // Verifique se o email já está registrado
            const [rows] = await conn.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (rows.length > 0) {
                return res.status(400).json({ error: "Email já cadastrado" });
            }

            // Gerar hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10); 
            // Insira o usuário no banco de dados com a senha hash
            const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            await conn.promise().query(sql, [nome, email, hashedPassword]);

            res.status(201).json({ message: "Conta criada com sucesso" });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }
};