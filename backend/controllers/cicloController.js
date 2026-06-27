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

const obterCalendario = async (req, res) => {
    try {
        //usuariaId vem do middleware de autenticação
        const usuariaId = req.usuariaId;
        const mes = parseInt(req.query.mes);
        const ano = parseInt(req.query.ano);

        //validacaoes basicas
        if (!mes || !ano || isNaN(mes) || isNaN(ano) || mes < 1 || mes > 12) {
            return res.status(400).json({
                erro: 'Informe um mês (1-12) e ano válidos como parâmetros.'
            });
        }

        const calendario = await cicloService.obterCalendario(usuariaId, mes, ano);

        return res.status(200).json(calendario);
    } catch (erro) {
        return res.status(500).json({
            erro: 'ERRO_BUSCA_CALENDARIO'
        });
    }

};

const alternarMenstruacaoDia = async (req, res) => {
    try {
        const usuariaid = req.usuariaId;
        const {data, mes, ano} = req.body;

        //validacao basica
        if(!data || !mes || !ano || isNaN(mes) || isNaN(ano)){
            return res.status(400).json({
                erro: 'Informe a data, mês e ano válidos no corpo da requisição.'
            });
        }
        //chamar logica do service
        //delegar responsabilidade pro service
        const resultado = await cicloService.alternarMenstruacaoDia(usuariaid, data, mes, ano);
        return res.status(200).json(resultado);
    } catch (erro) {
        return res.status(500).json({
            erro: 'ERRO_ALTERNAR_MENSTRUACAO_DIA'
        });
    }
}

module.exports = {
    obterDadosHome,
    alternarMenstruacaoHoje,
    obterCalendario,
    alternarMenstruacaoDia
}