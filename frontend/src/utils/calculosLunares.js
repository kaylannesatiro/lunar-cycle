const obterMetricasLunares = () => {
    const dataAtual = new Date();
    const luaNovaBase = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)); 
    const tamanhoCicloMs = 29.53058867 * 24 * 60 * 60 * 1000;
    const diferencaTempoMs = dataAtual.getTime() - luaNovaBase.getTime();
    const ciclosPassados = diferencaTempoMs / tamanhoCicloMs;
    const fracaoCicloAtual = ciclosPassados - Math.floor(ciclosPassados);
    
    // Dia do Ciclo Lunar
    const idadeLunar = fracaoCicloAtual * 29.53058867;
    const diaLunar = Math.ceil(idadeLunar) || 1; 
    
    // Dias para a Lua Cheia
    let diasParaCheia;
    if (idadeLunar <= 14.76) {
        diasParaCheia = Math.round(14.76 - idadeLunar);
    } else {
        diasParaCheia = Math.round(29.53058867 - idadeLunar + 14.76);
    }
    
    // Energia Lunar
    let energiaPercentual;
    if (idadeLunar <= 14.76) {
        energiaPercentual = (idadeLunar / 14.76) * 100;
    } else {
        energiaPercentual = ((29.53058867 - idadeLunar) / 14.76) * 100;
    }

    return {
        diaDoCicloLunar: diaLunar,
        faltamParaCheia: diasParaCheia,
        energia: Math.round(energiaPercentual)
    };
}

export default obterMetricasLunares