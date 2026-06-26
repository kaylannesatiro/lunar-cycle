const diaMenstruacaoRepository = require('../repositories/diaMenstruacaoRepository');
const usuariaRepository = require('../repositories/usuariaRepository');
const {obterFaselunar} = require('../utils/fasesLunares');

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
    const faseLunar = obterFaselunar(hoje);

    //verifica se hoje está marcado como dia de menstruação (para a Home saber o status do botão)
    const menstruandoHoje = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, hoje);

    //procura o registro de menstruacao mais recente para calcular o ciclo menstrual
    const ultimoRegistroMenstruacao = await diaMenstruacaoRepository.buscarUltimaMenstruacao(usuariaId);

    //Caso 1: Se não houer nenhum registro no banco de dados
    if(!ultimoRegistroMenstruacao){
        return{
            nomeUsuaria: usuaria.nome,
            faseLunar,
            menstruandoHoje,
            possuiCicloMenstrual: false,
            mensagemContextual:'Seja bem-vinda ao Lunar Cycle! Adicione o seu primeiro dia de menstruação para começar a acompanhar o seu ciclo e a sua conexão com a lua.'
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

    //Montar mensagem dinâmica contextial cruzando ciclo e fase da lua.

    let mensagemContextual = '';
    if (menstruandoHoje) {
        if (faseLunar.nome === 'Cheia') {
        mensagemContextual = "Sua menstruação coincide com a Lua Cheia (Ciclo da Lua Vermelha). É um momento de grande poder intuitivo e criatividade focada no exterior.";
        } else if (faseLunar.nome === 'Nova') {
        mensagemContextual = "Sua menstruação coincide com a Lua Nova (Ciclo da Lua Branca). Este é o alinhamento tradicional da natureza, ideal para descanso e renovação.";
        } else if (faseLunar.nome.includes('Crescente')) {
        mensagemContextual = "Menstruar na Lua Crescente traz uma dinâmica de renovação ativa. O seu corpo limpa o passado enquanto a lua impulsiona novos começos.";
        } else {
        mensagemContextual = "Menstruar na Lua Minguante potencializa a limpeza e o desapego. Excelente momento para libertar o que não serve mais.";
        } }
    else {
        if (faseLunar.nome === 'Cheia') {
        mensagemContextual = "A Lua Cheia brilha no céu e energia está no auge. Fase de alta sociabilidade e magnetismo pessoal expandido.";
        } else if (faseLunar.nome === 'Nova') {
        mensagemContextual = "A Lua Nova convida à quietude. Aproveite este momento fora do período menstrual para plantar intenções silenciosas.";
        } else if (faseLunar.nome.includes('Crescente')) {
        mensagemContextual = "Energia em expansão! A Lua Crescente impulsiona a agir, executar projetos e focar no crescimento.";
        } else {
        mensagemContextual = "Momento de transição. A Lua Minguante convida a desacelerar e a preparar o corpo com carinho para o próximo ciclo.";
        }
    }

    return {
        nomeUsuaria: usuaria.nome,
        faseLunar,
        menstruandoHoje,
        possuiCicloMenstrual: true,
        diaDoCiclo: diaDoCiclo > 0 ? diaDoCiclo : 1, // Garante que o dia do ciclo seja pelo menos 1
        previsaoProximoCiclo: previsaoProximoCiclo.toLocaleDateString('pt-BR'),
        mensagemContextual
    };
};

module.exports = {
    obterDadosHome
};