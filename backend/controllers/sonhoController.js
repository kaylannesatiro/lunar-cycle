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
            return res.status(400).json({ erro: error.message });
        }
        return res.status(500).json({ erro: 'Ocorreu um erro ao salvar o sonho. Tente novamente.' });
    }
}

const buscarSonhoPorId = async (req, res) => {
    try {
        const usuariaId = req.usuariaId; // Obtém o ID da usuária do token JWT injetado pelo middleware de autenticação 
        const { id } = req.params; // Obtém o ID do sonho dos parâmetros da rota
        const sonho = await sonhoService.buscarSonhoPorId(id, usuariaId);
        res.status(200).json(sonho);
    } catch(error){
        if (error.status === 404) {
            return res.status(404).json({ erro: error.message });
        }
        //erro generico
        return res.status(500).json({ erro: 'Ocorreu um erro ao carregar os dados do registro.'

        });
    }
};


module.exports = {
    criarSonho,
    buscarSonhoPorId
}