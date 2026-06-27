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
router.get('/', verificarToken, sonhoController.listar);

module.exports = router;