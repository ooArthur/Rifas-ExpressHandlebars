const express = require('express');
const expresshbs = require("express-handlebars");
const app = express();
const porta = 3000;

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.engine("handlebars", expresshbs.engine());
app.set("view engine", "handlebars");

const routes = require('./src/routes/routes');

app.use('/', routes);

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
