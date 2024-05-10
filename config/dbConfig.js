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

    // Conecta ao banco de dados
    conn.connect(function (err) {
        // Verifica se houve algum erro na conexão.
        if (err) {
            // Exibe uma mensagem de erro caso ocorra.
            console.error('Erro ao conectar ao banco de dados:', err);
            // Retorna para interromper o fluxo de execução.
            return;
        }
        // Exibe uma mensagem de sucesso ao conectar.
        console.log('Conectado ao banco de dados com sucesso!');

        // Criação do banco de dados, se não existir
        const criarBancoQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB}`;
        // Executa a consulta SQL para criar o banco de dados.
        conn.query(criarBancoQuery, function (err) {
            // Verifica se houve algum erro ao criar o banco de dados.
            if (err) {
                // Exibe uma mensagem de erro caso ocorra.
                console.error('Erro ao criar o banco de dados:', err);
                // Encerra a conexão com o servidor MySQL.
                conn.end();
                // Retorna para interromper o fluxo de execução.
                return;
            }
            // Exibe uma mensagem de sucesso ao criar o banco de dados.
            console.log('Banco de dados criado com sucesso ou já existente.');

            // Seleciona o banco de dados recém-criado ou existente
            conn.query(`USE ${process.env.DB}`, function (err) {
                // Verifica se houve algum erro ao selecionar o banco de dados.
                if (err) {
                    // Exibe uma mensagem de erro caso ocorra.
                    console.error('Erro ao selecionar o banco de dados:', err);
                    // Encerra a conexão com o servidor MySQL.
                    conn.end();
                    // Retorna para interromper o fluxo de execução.
                    return;
                }
                // Exibe uma mensagem de sucesso ao selecionar o banco de dados.
                console.log('Banco de dados selecionado com sucesso.');

                // Criação das tabelas, se não existirem
                // Cria a consulta SQL para criar a tabela de usuários se ela não existir.
                const criarTabelaUsuario = `
                    CREATE TABLE IF NOT EXISTS Usuarios (
                        ID INT AUTO_INCREMENT PRIMARY KEY,
                        Nome VARCHAR(100),
                        Email VARCHAR(100),
                        Senha VARCHAR(255) 
                    );
                `;
                // Executa a consulta SQL para criar a tabela de usuários.
                conn.query(criarTabelaUsuario, function (err) {
                    // Verifica se houve algum erro ao criar a tabela de usuários.
                    if (err) {
                        // Exibe uma mensagem de erro caso ocorra.
                        console.error('Erro ao criar tabela de Usuários:', err);
                        // Encerra a conexão com o servidor MySQL.
                        conn.end();
                        // Retorna para interromper o fluxo de execução.
                        return;
                    }
                    // Exibe uma mensagem de sucesso ao criar a tabela de usuários.
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
                    // Verifica se houve algum erro ao criar a tabela de Rifas.
                    if (err) {
                        // Exibe uma mensagem de erro caso ocorra.
                        console.error('Erro ao criar tabela de Rifas:', err);
                        // Encerra a conexão com o servidor MySQL.
                        conn.end();
                        // Retorna para interromper o fluxo de execução.
                        return;
                    }
                    // Exibe uma mensagem de sucesso ao criar a tabela de Rifas.
                    console.log('Tabela de Rifas criada com sucesso ou já existente.');
                });

                // Cria a consulta SQL para criar a tabela de Bilhetes se ela não existir.
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
                    // Verifica se houve algum erro ao criar a tabela de Bilhetes.
                    if (err) {
                        // Exibe uma mensagem de erro caso ocorra.
                        console.error('Erro ao criar tabela de Bilhetes:', err);
                        // Encerra a conexão com o servidor MySQL.
                        conn.end();
                        // Retorna para interromper o fluxo de execução.
                        return;
                    }
                    // Exibe uma mensagem de sucesso ao criar a tabela de Bilhetes.
                    console.log('Tabela de Bilhetes criada com sucesso ou já existente.');
                });

                // Cria a consulta SQL para criar a tabela de ImagensRifa se ela não existir.
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
                    // Verifica se houve algum erro ao criar a tabela de ImagensRifa.
                    if (err) {
                        // Exibe uma mensagem de erro caso ocorra.
                        console.error('Erro ao criar tabela de ImagensRifa:', err);
                        // Encerra a conexão com o servidor MySQL.
                        conn.end();
                        // Retorna para interromper o fluxo de execução.
                        return;
                    }
                    // Exibe uma mensagem de sucesso ao criar a tabela de ImagensRifa.
                    console.log('Tabela de ImagensRifa criada com sucesso ou já existente.');
                });
            });
        });
    });

    // Retorna a conexão com o banco de dados.
    return conn;
}

// Exporta a função de conexão com o banco de dados.
module.exports = conectarBancoDeDados();