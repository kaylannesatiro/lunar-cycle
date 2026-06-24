const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validaRequisicao = require('../middlewares/validaRequisicao');
const { criarContaSchema } = require('../schemas/authSchema');

//POST EM '/cadastro' PARA CRIAR CONTA
router.post('/cadastro',
    validaRequisicao(criarContaSchema),
    authController.criarConta);
    
module.exports = router;