const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validaRequisicao = require('../middlewares/validaRequisicao');
const { criarContaSchema, loginSchema } = require('../schemas/authSchema');
const verificarToken = require('../middlewares/autenticacao');

//rotas de api/auth

//POST EM '/cadastro' PARA CRIAR CONTA (HU-001)
router.post('/cadastro',
    validaRequisicao(criarContaSchema),
    authController.criarConta);
    
//POST EM '/login' PARA REALIZAR LOGIN (HU-002)
router.post('/login', validaRequisicao(loginSchema), authController.realizarLogin);

//GET EM '/perfil' PARA OBTER DADOS DO PERFIL (HU-004)
//privada, precisa de token JWT para acessar.
router.get('/perfil', verificarToken, authController.obterDadosPerfil);


module.exports = router;