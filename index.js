// index.js

const express = require('express');
const expresshbs = require("express-handlebars");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const porta = process.env.PORT;
const conn = require('./config/dbConfig');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine("handlebars", expresshbs.engine());
app.set("view engine", "handlebars");

require('./models/dbTables')();
const routes = require('./routes/routes');
app.use('/', routes);

conn.connect(function (err) {
    if (err) {
        console.log("Banco de Dados MySql: Erro ao conectar!");
        console.log(err);
        return;
    }
    app.listen(porta, () => {
        console.log(`Servidor rodando na porta ${porta}, http://localhost:${porta}`);
    });
});
