const mysql2 = require('mysql2');
require("dotenv").config();

const conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

// Verifica se o banco de dados e as tabelas existem, se não existirem, cria-os
/* conn.connect(function(err) {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');

    // Criação do banco de dados, se não existir
    conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB}`, function(err) {
        if (err) {
            console.error('Erro ao criar o banco de dados:', err);
            return;
        }
        console.log('Banco de dados criado com sucesso ou já existe.');

        // Seleciona o banco de dados recém-criado ou existente
        conn.query(`USE ${process.env.DB}`, function(err) {
            if (err) {
                console.error('Erro ao selecionar o banco de dados:', err);
                return;
            }
            console.log('Banco de dados selecionado com sucesso.');

            // Criação da tabela, se não existir
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS sua_tabela (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    coluna1 VARCHAR(255),
                    coluna2 VARCHAR(255),
                    ...
                )
            `;
            conn.query(createTableQuery, function(err) {
                if (err) {
                    console.error('Erro ao criar a tabela:', err);
                    return;
                }
                console.log('Tabela criada com sucesso ou já existe.');
            });
        });
    });
}); */

module.exports = conn;