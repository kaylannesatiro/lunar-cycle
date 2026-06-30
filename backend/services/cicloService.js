const diaMenstruacaoRepository = require('../repositories/diaMenstruacaoRepository');
const usuariaRepository = require('../repositories/usuariaRepository');
const { obterFaseLunar } = require('../utils/fasesLunares');

const obterDadosHome = async (usuariaId) =>{
    const usuaria = await usuariaRepository.buscarPorId(usuariaId);
    if(!usuaria){
        throw new Error('Usuária não encontrada');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const faseLunar = obterFaseLunar(hoje);
    const menstruandoHoje = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, hoje);
    const ultimoRegistroMenstruacao = await diaMenstruacaoRepository.buscarUltimaMenstruacao(usuariaId);

    if(!ultimoRegistroMenstruacao){
        return{
            nomeUsuaria: usuaria.nome,
            faseLunar,
            menstruandoHoje,
            possuiCicloMenstrual: false
        };
    }

    let dataInicioCiclo = new Date(ultimoRegistroMenstruacao.data);

    while(true){
        const diaAnterior = new Date(dataInicioCiclo);
        diaAnterior.setDate(diaAnterior.getDate() - 1);

        const estamarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, diaAnterior);
        if(estamarcado){
            dataInicioCiclo = diaAnterior;
        } else {
            break;
        }
    }

    const diffTempo = hoje.getTime() - dataInicioCiclo.getTime();
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
    const diaDoCiclo = diffDias + 1;

    const previsaoProximoCiclo = new Date(dataInicioCiclo);
    previsaoProximoCiclo.setDate(previsaoProximoCiclo.getDate() + usuaria.duracaoCiclo);

    return {
        nomeUsuaria: usuaria.nome,
        faseLunar,
        menstruandoHoje,
        possuiCicloMenstrual: true,
        diaDoCiclo: diaDoCiclo > 0 ? diaDoCiclo : 1,
        previsaoProximoCiclo: previsaoProximoCiclo.toLocaleDateString('pt-BR')
    };
};


const alternarMenstruacaoHoje = async (usuariaId) =>{
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const jaEstaMarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, hoje);

    if(jaEstaMarcado){
        await diaMenstruacaoRepository.desmarcarDia(usuariaId, hoje);
    } else{
        await diaMenstruacaoRepository.registrarDia(usuariaId, hoje);
    }

    const dadosHomeAtualizados = await obterDadosHome(usuariaId);

    return{
        acao: jaEstaMarcado ? 'desmarcado' : 'registrado',
        dadosHome: dadosHomeAtualizados
    };
};

const obterCalendario = async (usuariaId, mes, ano) => {
    const usuaria = await usuariaRepository.buscarPorId(usuariaId);
    if (!usuaria) {
        throw new Error('Usuária não encontrada');
    }

    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0);

    const diasRegistrados = await diaMenstruacaoRepository.buscarDiasPorIntervalo(usuariaId, dataInicio, dataFim);
    const datasRegistradas = new Set(diasRegistrados.map(dia => dia.data.toISOString().split('T')[0]));

    const datasPrevistas = new Set();
    const ultimoRegistroMenstruacao = await diaMenstruacaoRepository.buscarUltimaMenstruacao(usuariaId);

    if (ultimoRegistroMenstruacao) {
        let dataInicioCiclo = new Date(ultimoRegistroMenstruacao.data);
        while (true) {
            const diaAnterior = new Date(dataInicioCiclo);
            diaAnterior.setDate(diaAnterior.getDate() - 1);
            const estaMarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, diaAnterior);
            if (estaMarcado) {
                dataInicioCiclo = diaAnterior;
            } else {
                break;
            }
        }

        // CORREÇÃO BUG: o loop agora avança até encontrar um ciclo que
        // cruze o mês pedido, em vez de parar antes de entrar nele.
        // Antes: "while (inicioPrevisto <= dataFim)" nunca entrava se a
        // previsão caísse em mês futuro. Agora avançamos enquanto o início
        // previsto ainda não chegou ao começo do mês exibido.
        let inicioPrevisto = new Date(dataInicioCiclo);
        inicioPrevisto.setDate(inicioPrevisto.getDate() + usuaria.duracaoCiclo);

        // Avança ciclo a ciclo até chegar no mês que o calendário está mostrando
        while (inicioPrevisto < dataInicio) {
            inicioPrevisto.setDate(inicioPrevisto.getDate() + usuaria.duracaoCiclo);
        }

        // Agora marca os dias previstos que caem dentro do mês exibido
        while (inicioPrevisto <= dataFim) {
            for (let i = 0; i < usuaria.duracaoMenstruacao; i++) {
                const diaPrevisto = new Date(inicioPrevisto);
                diaPrevisto.setDate(diaPrevisto.getDate() + i);
                const chave = diaPrevisto.toISOString().split('T')[0];
                if (!datasRegistradas.has(chave)) {
                    datasPrevistas.add(chave);
                }
            }
            inicioPrevisto.setDate(inicioPrevisto.getDate() + usuaria.duracaoCiclo);
        }
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diasDoMes = [];
    const totalDias = dataFim.getDate();

    for (let dia = 1; dia <= totalDias; dia++) {
        const dataAtual = new Date(ano, mes - 1, dia);
        const chave = dataAtual.toISOString().split('T')[0];
        diasDoMes.push({
            data: chave,
            faseLunar: obterFaseLunar(dataAtual),
            registrada: datasRegistradas.has(chave),
            prevista: datasPrevistas.has(chave),
            hoje: dataAtual.getTime() === hoje.getTime()
        });
    }

    return {
        mes,
        ano,
        dias: diasDoMes
    };
};

const alternarMenstruacaoDia = async (usuariaId, dataStr, mes, ano) => {
    // CORREÇÃO BUG: trocamos setUTCHours por setHours para usar o
    // mesmo fuso local que o resto do código usa ao criar datas.
    // Com setUTCHours(0,0,0,0) no Brasil (UTC-3), "2026-06-15T00:00:00Z"
    // virava "2026-06-14T21:00:00" no horário local — o Prisma não
    // encontrava o registro e o dia sumia ou duplicava.
    const [anoStr, mesStr, diaStr] = dataStr.split('-');
    const data = new Date(Number(anoStr), Number(mesStr) - 1, Number(diaStr));
    data.setHours(0, 0, 0, 0);

    const jaEstaMarcado = await diaMenstruacaoRepository.verificarDiaMarcado(usuariaId, data);

    if(jaEstaMarcado){
        await diaMenstruacaoRepository.desmarcarDia(usuariaId, data);
    } else{
        await diaMenstruacaoRepository.registrarDia(usuariaId, data);
    }

    const calendarioAtualizado = await obterCalendario(usuariaId, mes, ano);

    return{
        acao: jaEstaMarcado ? 'desmarcado' : 'registrado',
        calendario: calendarioAtualizado
    }
}

module.exports = {
    obterDadosHome,
    alternarMenstruacaoHoje,
    obterCalendario,
    alternarMenstruacaoDia
};
