const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validaRequisicao = require('../middlewares/validaRequisicao');
const { criarContaSchema, loginSchema } = require('../schemas/authSchema');

//POST EM '/cadastro' PARA CRIAR CONTA (HU-001)
router.post('/cadastro',
    validaRequisicao(criarContaSchema),
    authController.criarConta);
    
//POST EM '/login' PARA REALIZAR LOGIN (HU-002)
router.post('/login', validaRequisicao(loginSchema), authController.realizarLogin);


module.exports = router;