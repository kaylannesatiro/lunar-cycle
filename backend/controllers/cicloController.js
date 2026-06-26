const cicloService = require('../services/cicloService');

const obterDadosHome = async (req, res) => {
    try{
        const usuariaId = req.usuariaId; // Middleware de autenticação adiciona o id da usuária no objeto de requisição
        const dadosHome = await cicloService.obterDadosHome(usuariaId);
        return res.status(200).json(dadosHome);
    } catch (erro) {
        return res.status(500).json({
            erro: "ERRO_BUSCA_HOME"
        });
    }
};

const alternarMenstruacaoHoje = async (req, res) => {
    try{
        const usuariaId = req.usuariaId;

        //controller delega tudo pro service.
        const resultado = await cicloService.alternarMenstruacaoHoje(usuariaId);

        return res.status(200).json(resultado);
    } catch (erro) {
        return res.status(500).json({
            erro: "ERRO_ALTERNAR_MENSTRUACAO_HOJE"
        });
    }
};

module.exports = {
    obterDadosHome,
    alternarMenstruacaoHoje
}