const conn = require('../config/dbConfig');

exports.getLista = (req, res) => {
    const sql = "SELECT * FROM produtos";

    conn.query(sql, function (error, data) {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao obter a lista de produtos');
            return;
        }
        const lista = data;
        res.render("listas", { lista });
    });
};

exports.insertProduto = (req, res) => {
    const produto = req.body.Produto;
    const preco = req.body.Preco;
    const descricao = req.body.Descricao;

    const sql = `INSERT INTO Produtos(Produto, Preco, Descricao) VALUES('${produto}', '${preco}', '${descricao}');`;

    conn.query(sql, function (err) {
        if (err) {
            console.log('Erro: ', err);
            return false;
        }
        res.redirect("/lista");
    });
};