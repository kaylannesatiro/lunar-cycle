const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//POST EM '/cadastro' PARA CRIAR CONTA
router.post('/cadastro', authController.criarConta);

module.exports = router;