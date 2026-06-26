const diaMenstruacaoRepository = require('../repositories/diaMenstruacaoRepository');
const usuariaRepository = require('../repositories/usuariaRepository');
const { obterFaseLunar } = require('../utils/fasesLunares');

const obterDadosHome = async (usuariaId) =>{
    // Verifica se a usuária existe
    const usuaria = await usuariaRepository.buscarPorId(usuariaId);
    if(!usuaria){
        throw new Error('Usuária não encontrada');
    }

    // Obtém a data atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

    //calcular a fase da lua para o dia de hoje
    //função vindo de utils/fasesLunares.js
    const faseLunar = obterFaseLunar(hoje);

    //verifica se hoje está marcado como dia de menstruação (para a Home saber o status do botão)
    const menstruandoHoje = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, hoje);

    //procura o registro de menstruacao mais recente para calcular o ciclo menstrual
    const ultimoRegistroMenstruacao = await diaMenstruacaoRepository.buscarUltimaMenstruacao(usuariaId);

    //Caso 1: Se não houver nenhum registro no banco de dados
    if(!ultimoRegistroMenstruacao){
        return{
            nomeUsuaria: usuaria.nome,
            faseLunar,
            menstruandoHoje,
            possuiCicloMenstrual: false
        };
    }

    //Caso 2: Se houver registro no banco de dados
    let dataInicioCiclo = new Date(ultimoRegistroMenstruacao.data);

    while(true){
        const diaAnterior = new Date(dataInicioCiclo);
        diaAnterior.setDate(diaAnterior.getDate() - 1);

        const estamarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, diaAnterior);
        if(estamarcado){
            dataInicioCiclo = diaAnterior;   //Continua a andar para trás até encontrar o primeiro dia do ciclo      
        } else {
            break; // O periodo contínuo começou, então sai do loop.
        }
    }

    //Calcula o número do dia atual do ciclo
    const diffTempo = hoje.getTime() - dataInicioCiclo.getTime();
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    const diaDoCiclo = diffDias + 1; // Adiciona 1 para contar o dia atual

    //Calcula a previsão de início do próximo ciclo (inicio atual + duracao do ciclo)
    const previsaoProximoCiclo = new Date(dataInicioCiclo);
    previsaoProximoCiclo.setDate(previsaoProximoCiclo.getDate() + usuaria.duracaoCiclo);

    // (O bloco de Montar mensagem dinâmica contextual foi removido para o Front-end)

    return {
        nomeUsuaria: usuaria.nome,
        faseLunar,
        menstruandoHoje,
        possuiCicloMenstrual: true,
        diaDoCiclo: diaDoCiclo > 0 ? diaDoCiclo : 1, // Garante que o dia do ciclo seja pelo menos 1
        previsaoProximoCiclo: previsaoProximoCiclo.toLocaleDateString('pt-BR')
    };
};


// Função para alternar o status de menstruação do dia atual
const alternarMenstruacaoHoje = async (usuariaId) =>{
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const jaEstaMarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, hoje);

    if(jaEstaMarcado){
        await diaMenstruacaoRepository.desmarcarDia(usuariaId, hoje);
    } else{
        await diaMenstruacaoRepository.registrarDia(usuariaId, hoje);
    }

    //Pega os dados atualizados para devolver à tela
    const dadosHomeAtualizados = await obterDadosHome(usuariaId);

    return{
        acao: jaEstaMarcado ? 'desmarcado' : 'registrado',
        dadosHome: dadosHomeAtualizados
    };
};

module.exports = {
    obterDadosHome,
    alternarMenstruacaoHoje
};