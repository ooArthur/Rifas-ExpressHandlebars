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
            CREATE TABLE IF NOT EXISTS Usuarios (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Nome VARCHAR(100),
                Email VARCHAR(100),
                Senha VARCHAR(255) 
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
            CREATE TABLE IF NOT EXISTS Rifas (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT,
                NomeRifa VARCHAR(100),
                Descricao TEXT,
                NumMaxBilhetes INT,
                ValorBilhete DECIMAL(10, 2),
                DataInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
                DataTermino DATETIME,
                FOREIGN KEY (UserID) REFERENCES Usuarios(ID)
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

        // Crie consultas semelhantes para criar as outras tabelas (Bilhetes, ImagensRifa) da mesma forma

        // Crie a consulta SQL para criar a tabela de Bilhetes se ela não existir.
        const criarTabelaBilhetes = `
            CREATE TABLE IF NOT EXISTS Bilhetes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                RifaID INT,
                NumeroBilhete INT,
                CompradorNome VARCHAR(100),
                FOREIGN KEY (RifaID) REFERENCES Rifas(ID)
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

        // Crie a consulta SQL para criar a tabela de ImagensRifa se ela não existir.
        const criarTabelaImagensRifa = `
            CREATE TABLE IF NOT EXISTS ImagensRifa (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                RifaID INT,
                NomeArquivo VARCHAR(255),
                DadosImagem BLOB,
                FOREIGN KEY (RifaID) REFERENCES Rifas(ID)
            );
        `;
        // Executa a consulta SQL para criar a tabela de ImagensRifa.
        conn.query(criarTabelaImagensRifa, function (err) {
            if (err) {
                console.error('Erro ao criar tabela de ImagensRifa:', err);
                conn.end();
                return;
            }
            console.log('Tabela de ImagensRifa criada com sucesso ou já existente.');
        });
    });
};
