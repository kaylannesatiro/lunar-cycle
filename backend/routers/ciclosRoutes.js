const express = require('express');
const router = express.Router();
const cicloController = require('../controllers/cicloController');
const verificarToken = require('../middlewares/autenticacao');

//ROTAS em /ciclos

//ROTA /home - GET - Retorna os dados da Home (fase lunar, status do botão de menstruação, dia do ciclo, previsão do próximo ciclo)
router.get('/home', verificarToken, cicloController.obterDadosHome);
//ROTA /home/toggle-hoje - POST - Alterna o status do dia de menstruação de hoje (marcado/desmarcado)
router.post('/home/toggle-hoje', verificarToken, cicloController.alternarMenstruacaoHoje);

module.exports = router;