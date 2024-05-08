// Importa o framework Express, que simplifica a criação de aplicativos web em Node.js
const express = require('express');
// Importa o módulo 'express-handlebars', que permite usar o Handlebars como mecanismo de visualização no Express
const expresshbs = require("express-handlebars");
// Inicializa o aplicativo Express
const app = express();
// Importando as configurações do arquivo .env
require("dotenv").config();
// Define a porta com base no arquivo .env em que o servidor irá escutar as requisições HTTP 
const porta = process.env.PORT;
// Importa a conexão com o banco de dados
const conn = require('./src/config/dbConfig');
// Configura o middleware para analisar solicitações com o tipo de conteúdo 'application/x-www-form-urlencoded'
app.use(
    express.urlencoded({
        extended: true
    })
);
// Configura o middleware para analisar solicitações com o tipo de conteúdo 'application/json'
app.use(express.json());
// Configura o Handlebars como mecanismo de visualização para o Express
app.engine("handlebars", expresshbs.engine());
app.set("view engine", "handlebars");
// Importa as rotas definidas em outro arquivo
const routes = require('./src/routes/routes');
// Define o uso das rotas no aplicativo Express
app.use('/', routes);
// Conecta ao banco de dados e inicia o servidor
conn.connect(function (err) {
    if (err) {
        console.log("Banco de Dados MySql: Erro ao conectar!");
        console.log(err);
        return;
    }
    // Se a conexão for bem-sucedida, inicia o servidor Express para escutar as requisições na porta especificada
    app.listen(porta, () => {
        console.log(`Servidor rodando na porta ${porta}`);
    });
});