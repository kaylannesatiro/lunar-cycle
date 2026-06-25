const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validaRequisicao = require('../middlewares/validaRequisicao');
const { criarContaSchema, loginSchema, atualizarPerfilSchema } = require('../schemas/authSchema');
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


//PUT EM '/perfil' PARA ATUALIZAR DADOS DO PERFIL (HU-005)
//privada, precisa de token JWT para acessar.
router.put('/perfil', verificarToken, validaRequisicao(atualizarPerfilSchema), authController.atualizarPerfil);
module.exports = router;