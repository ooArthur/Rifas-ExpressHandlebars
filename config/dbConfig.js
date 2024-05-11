// Importa o módulo mysql2 para interagir com o MySQL.
const mysql2 = require('mysql2');

// Importa o módulo dotenv para carregar variáveis de ambiente a partir do arquivo .env.
require("dotenv").config();

// Função para conectar ao banco de dados e criar tabelas, se necessário
function conectarBancoDeDados() {
    // Cria uma conexão com o banco de dados MySQL.
    const conn = mysql2.createConnection({
        // Obtém o host do banco de dados a partir das variáveis de ambiente.
        host: process.env.DB_HOST,
        // Obtém o usuário do banco de dados a partir das variáveis de ambiente.
        user: process.env.DB_USER,
        // Obtém a senha do banco de dados a partir das variáveis de ambiente.
        password: process.env.DB_PASS,
    });

    // Retorna a conexão com o banco de dados.
    return conn;
}

// Exporta a função de conexão com o banco de dados.
module.exports = conectarBancoDeDados();