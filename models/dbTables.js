// Importa a conexão com o banco de dados
const conn = require('../config/dbConfig');

// Exporta uma função que cria as tabelas, se necessário
module.exports = function criarTabelas() {
    // Conecta ao banco de dados
    conn.connect(function (err) {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return;
        }
        console.log('Conectado ao banco de dados com sucesso!');

        // Criação das tabelas, se não existirem
        const criarTabelaUsuario = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL
        );
        `;
        conn.query(criarTabelaUsuario, function (err) {
            if (err) {
                console.error('Erro ao criar tabela de Usuários:', err);
                conn.end();
                return;
            }
            console.log('Tabela de usuários criada com sucesso ou já existente.');
        });

        // Cria a consulta SQL para criar a tabela de Rifas se ela não existir.
        const criarTabelaRifas = `
        CREATE TABLE IF NOT EXISTS rifas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT,
            nomeRifa VARCHAR(100) NOT NULL,
            descricao TEXT,
            numMaxBilhetes INT,
            valorBilhete DECIMAL(10, 2),
            dataInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
            dataTermino DATETIME,
            FOREIGN KEY (userId) REFERENCES usuarios(id)
        );
        `;
        // Executa a consulta SQL para criar a tabela de Rifas.
        conn.query(criarTabelaRifas, function (err) {
            if (err) {
                console.error('Erro ao criar tabela de Rifas:', err);
                conn.end();
                return;
            }
            console.log('Tabela de Rifas criada com sucesso ou já existente.');
        });

        // Crie a consulta SQL para criar a tabela de Bilhetes se ela não existir.
        const criarTabelaBilhetes = `
        CREATE TABLE IF NOT EXISTS bilhetes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            rifaId INT,
            numeroBilhete INT NOT NULL,
            compradorNome VARCHAR(100),
            FOREIGN KEY (rifaId) REFERENCES rifas(id)
        );
        `;
        // Executa a consulta SQL para criar a tabela de Bilhetes.
        conn.query(criarTabelaBilhetes, function (err) {
            if (err) {
                console.error('Erro ao criar tabela de Bilhetes:', err);
                conn.end();
                return;
            }
            console.log('Tabela de Bilhetes criada com sucesso ou já existente.');
        });
    });
};