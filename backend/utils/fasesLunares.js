const obterFaselunar = (data) => {
    //Duração exata de um ciclo lunar completo é de 29.530588853 dias, ou 29 dias, 12 horas, 44 minutos e 2,8 segundos.
    const CICLO_LUNAR_MS = 29.530588853 * 24 * 60 * 60 * 1000;

    //Data histórica de uma lua nova de referencia(6 de janeiro de 2000)
    const LUA_NOVA_REFERENCIA = new Date('2000-01-06T18:14:00Z').getTime();

    //Tempo decorrido desde a lua nova de referência até a data fornecida
    const tempoDecorrido = data.getTime() - LUA_NOVA_REFERENCIA;

    //Quantos dias se passaram dentro do ciclo atual de 29.5 dias

    let diasDoCiclo = (tempoDecorrido % CICLO_LUNAR_MS) / (24 * 60 * 60 * 1000);

    // Se for negativo, ajusta para o ciclo positivo

    if (diasDoCiclo < 0) {
        diasDoCiclo += 29.530588853;
    }


    // Determina a fase da lua com base nos dias do ciclo
    if (diasDoCiclo >= 0 && diasDoCiclo < 7.38) {
        return { nome: 'Nova', icone: '🌑' };
    } else if (diasDoCiclo >= 7.38 && diasDoCiclo < 14.76) {
        return { nome: 'Crescente', icone: '🌓' };
    } else if (diasDoCiclo >= 14.76 && diasDoCiclo < 22.14) {
        return { nome: 'Cheia', icone: '🌕' };
    } else {
        return { nome: 'Minguante', icone: '🌗' };
    }

}