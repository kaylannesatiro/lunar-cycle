const sonhoService = require('../services/sonhoService');

const criarSonho = async (req, res) => {
    try {
        const usuariaId = req.usuariaId; // Obtém o ID da usuária do token JWT injetado pelo middleware de autenticação
        const dados = req.body;
        //delegar a criação do sonho para o serviço
        const sonhoCriado = await sonhoService.criarSonho(usuariaId, dados);
        res.status(201).json(sonhoCriado);
    } catch (error) {
        //Se o erro vier do serviço, ele será capturado aqui e retornado como resposta
        if (error.message && error.message !== 'Usuária não encontrada') {
            res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


module.exports = {
    criarSonho
}