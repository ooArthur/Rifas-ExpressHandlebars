// Importa o módulo 'bcrypt' para criptografia de senha
const bcrypt = require('bcrypt');

// Importa o módulo 'jsonwebtoken' para geração de tokens JWT
const jwt = require('jsonwebtoken');

// Importa a conexão com o banco de dados
const conn = require('../config/dbConfig');

// Importa o módulo 'dotenv' para carregar variáveis de ambiente a partir de um arquivo '.env'
require('dotenv').config();

// Exporta um objeto contendo o método de login
module.exports = {
    async login(req, res) {
        // Extrai o email e senha do corpo da requisição
        const { email, senha } = req.body;

        try {
            // Consulta o banco de dados para encontrar um usuário com o email fornecido
            const [rows] = await conn.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
            
            // Verifica se não há nenhum usuário com o email fornecido
            if (rows.length === 0) {
                return res.status(404).json({ error: "Email não cadastrado" });
            }

            // Obtém o primeiro usuário retornado pela consulta
            const user = rows[0];
            
            // Compara a senha fornecida com a senha armazenada no banco de dados
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            
            // Verifica se a senha não é válida
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            // Gera um token JWT contendo o ID do usuário
            const token = jwt.sign({ userId: user.id }, process.env.JWTSECRET, { expiresIn: '1h' });
            
            // Retorna o token JWT como resposta da requisição
            res.status(200).json({ token });
        } catch (error) {
            // Em caso de erro, registra o erro no console e retorna uma resposta de erro
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: "Erro ao fazer login" });
        }
    }
};