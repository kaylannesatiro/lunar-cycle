export const obterFaseLunar = (data) => {
    // Duração exata de um ciclo lunar completo
    const CICLO_LUNAR_DIAS = 29.530588853;
    const CICLO_LUNAR_MS = CICLO_LUNAR_DIAS * 24 * 60 * 60 * 1000;

    // Data histórica de uma lua nova de referência (6 de janeiro de 2000)
    const LUA_NOVA_REFERENCIA = new Date('2000-01-06T18:14:00Z').getTime();

    // Tempo decorrido desde a lua nova de referência até a data fornecida
    const tempoDecorrido = data.getTime() - LUA_NOVA_REFERENCIA;

    // Quantos dias se passaram dentro do ciclo atual de 29.5 dias
    let diasDoCiclo = (tempoDecorrido % CICLO_LUNAR_MS) / (24 * 60 * 60 * 1000);

    // Se for negativo, ajusta para o ciclo positivo
    if (diasDoCiclo < 0) {
        diasDoCiclo += CICLO_LUNAR_DIAS;
    }

    // O ciclo tem 8 fases.
    const indice = Math.floor(((diasDoCiclo + (CICLO_LUNAR_DIAS / 16)) / CICLO_LUNAR_DIAS) * 8) % 8;

    const fases = [
        { nome: 'Nova', icone: '🌑' },
        { nome: 'Crescente Côncava', icone: '🌒' },
        { nome: 'Crescente', icone: '🌓' },
        { nome: 'Gibosa Crescente', icone: '🌔' },
        { nome: 'Cheia', icone: '🌕' },
        { nome: 'Gibosa Minguante', icone: '🌖' },
        { nome: 'Minguante', icone: '🌗' },
        { nome: 'Minguante Côncava', icone: '🌘' }
    ];

    return fases[indice];
}