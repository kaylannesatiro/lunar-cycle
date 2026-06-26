const express = require('express');
const router = express.Router();
const cicloController = require('../controllers/cicloController');
const verificarToken = require('../middlewares/autenticacao');

//ROTAS em /ciclos

//ROTA /home - GET - Retorna os dados da Home (fase lunar, status do botão de menstruação, dia do ciclo, previsão do próximo ciclo)
router.get('/home', verificarToken, cicloController.obterDadosHome);
//ROTA /home/toggle-hoje - POST - Alterna o status do dia de menstruação de hoje (marcado/desmarcado)
router.post('/home/toggle-hoje', verificarToken, cicloController.alternarMenstruacaoHoje);
// ROTA /calendario - GET - Retorna os dados do calendário de um mês específico
// Parâmetros obrigatórios (query params):
//   - mes: número do mês desejado (1 a 12). Exemplo: 7 para julho
//   - ano: ano com 4 dígitos. Exemplo: 2025
// Exemplo de requisição: GET /api/ciclos/calendario?mes=7&ano=2025
router.get('/calendario', verificarToken, cicloController.obterCalendario);

module.exports = router;