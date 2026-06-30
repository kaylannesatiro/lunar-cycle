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

const atualizarSonho = async (req, res) => {
    try {
        const usuariaId = req.usuariaId; // Veio do token
        const { id } = req.params; // Veio da URL
        const dados = req.body; // Dados novos do sonho

        const sonhoAtualizado = await sonhoService.atualizarSonho(id, usuariaId, dados);
        
        return res.status(200).json(sonhoAtualizado);
    } catch (error) {
        // Se for erro de 404 (Sonho não encontrado)
        if (error.status === 404) {
            return res.status(404).json({ erro: error.message });
        }
        
        // Se for erro de validação (tamanho, data, etc)
        if (error.message && error.message !== 'Usuária não encontrada') {
            return res.status(400).json({ erro: error.message });
        }
        
        // Erro genérico
        return res.status(500).json({ 
            erro: 'Ocorreu um erro ao salvar a edição.' 
        });
    }
};

const excluir = async (req, res) => {
    try {
        const usuariaId = req.usuariaId; // Veio do token
        const { id } = req.params; // Veio da URL

        await sonhoService.deletarSonho(id, usuariaId);
        
        // Retorna 204 No Content (sucesso, mas sem corpo de resposta)
        return res.status(204).send();
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ erro: error.message });
        }
        
        return res.status(500).json({ 
            erro: 'Ocorreu um erro ao excluir o registro. Tente novamente.' 
        });
    }
};

const listarSonhos = async (req, res) => {
    try {
        const usuariaId = req.usuariaId; 
        // Pega as variáveis da Query String (ex: ?tag=voo&dataInicio=2026-06-01)
        const { tag, dataInicio, dataFim } = req.query; 
        // Empacota tudo num objeto e manda pro service
        const filtros = { tag, dataInicio, dataFim };
        const sonhos = await sonhoService.listarSonhos(usuariaId, filtros);
        
        return res.status(200).json(sonhos);
    } catch (error) {
        // Se a validação de dataInicio > dataFim do Service estourar, devolvemos 400 Bad Request
        if (error.message === 'A data de início não pode ser maior que a data de fim.') {
            return res.status(400).json({ erro: error.message });
        }
        return res.status(500).json({ 
            erro: 'Ocorreu um erro ao carregar a listagem de sonhos.' 
        });
    }
};

module.exports = {
    criarSonho,
    buscarSonhoPorId,
    atualizarSonho,
    excluir,
    listarSonhos
}