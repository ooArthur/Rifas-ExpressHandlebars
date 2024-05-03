const express = require('express');
const router = express.Router();
const controller = require('../controllers/appController');

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/lista", controller.getLista);

router.post("/lista/insertProdutos", controller.insertProduto);

module.exports = router;