export const converterDataBRParaISO = (dataBR) => {
    if (!dataBR) return ''
    const [dia, mes, ano] = dataBR.split('/')
    return `${ano}-${mes}-${dia}`
}

export const formatarDataObjParaBR = (dataObj) => {
    return `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}/${dataObj.getUTCFullYear()}`
}

export const obterDatasDoPeriodo = (periodo, datas) => {
    if (datas?.inicio && datas?.fim) {
        return { dataInicio: datas.inicio, dataFim: datas.fim }
    }
    
    const hoje = new Date()
    const anoAtual = hoje.getFullYear()
    
    if (/^\d{4}$/.test(periodo)) {
        return { dataInicio: `${periodo}-01-01`, dataFim: `${periodo}-12-31` }
    }
    
    if (periodo.includes("a") && periodo.includes("/")) {
        const [inicioParte, fimParte] = periodo.split(" a ")
        const [diaIni, mesIni] = inicioParte.split("/").map(Number)
        const [diaFim, mesFim] = fimParte.split("/").map(Number)
        
        const anoInicio = mesIni > mesFim ? anoAtual - 1 : anoAtual

        const dIni = `${anoInicio}-${String(mesIni).padStart(2, '0')}-${String(diaIni).padStart(2, '0')}`
        const dFim = `${anoAtual}-${String(mesFim).padStart(2, '0')}-${String(diaFim).padStart(2, '0')}`
        
        return { dataInicio: dIni, dataFim: dFim }
    }
    
    return { dataInicio: undefined, dataFim: undefined }
}