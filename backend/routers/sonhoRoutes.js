const express = require('express');
const router = express.Router();
const sonhoController = require('../controllers/sonhoController');
const verificarToken = require('../middlewares/autenticacao');

// ROTA POST / - Criar um novo sonho
// Body esperado: { titulo, descricao, dataSonho (YYYY-MM-DD), tags (array de strings) }
router.post('/', verificarToken, sonhoController.criarSonho);
// ROTA GET /:id - Buscar detalhes de um sonho específico
router.get('/:id', verificarToken, sonhoController.buscarSonhoPorId);

module.exports = router;