const express = require('express');
const router = express.Router();
const sonhoController = require('../controllers/sonhoController');
const verificarToken = require('../middlewares/autenticacao');

// ROTA POST / - Criar um novo sonho
// Body esperado: { titulo, descricao, dataSonho (YYYY-MM-DD), tags (array de strings) }
router.post('/', verificarToken, sonhoController.criarSonho);
// ROTA GET /:id - Buscar detalhes de um sonho específico
router.get('/:id', verificarToken, sonhoController.buscarSonhoPorId);
// ROTA PUT /:id - Editar um registro do diário de sonhos
// Body esperado: { titulo, descricao, dataSonho, tags }
router.put('/:id', verificarToken, sonhoController.atualizarSonho);
// ROTA DELETE /:id - Excluir um registro do diário de sonhos
router.delete('/:id', verificarToken, sonhoController.excluir);
// ROTA GET / - Listar todos os sonhos da usuária
// Filtros opcionais via Query Params (?chave=valor):
// - tag: string (busca sonhos que contenham a tag especificada)
// - dataInicio: YYYY-MM-DD (busca sonhos a partir desta data)
// - dataFim: YYYY-MM-DD (busca sonhos até esta data)
// Exemplo: GET /?tag=pesadelo&dataInicio=2026-06-01&dataFim=2026-06-30
router.get('/', verificarToken, sonhoController.listarSonhos);

module.exports = router;