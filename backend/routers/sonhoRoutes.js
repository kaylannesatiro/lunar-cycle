const express = require('express');
const router = express.Router();
const sonhoController = require('../controllers/sonhoController');
const verificarToken = require('../middlewares/verificarToken');

// ROTA POST / - Criar um novo sonho
// Body esperado: { titulo, descricao, dataSonho (YYYY-MM-DD), tags (array de strings) }
router.post('/', verificarToken, sonhoController.criar);
module.exports = router;