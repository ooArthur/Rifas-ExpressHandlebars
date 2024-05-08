const express = require('express');
const router = express.Router();
const controller = require('../controllers/appController');

router.get("/", (req, res) => {
    res.render("home");
});

module.exports = router;