export const parseDataBr = (dataStr) => {
    if (!dataStr) return new Date()
    const [dia, mes, ano] = dataStr.split('/')
    return new Date(ano, mes - 1, dia)
}

export const formatarDataISO = (data) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

export const gerarIntervaloDeDatas = (dataInicioBr, dataFimBr, duracaoPadrao) => {
    if (!dataInicioBr) return []
    
    const inicio = parseDataBr(dataInicioBr)
    let fim
    
    if (dataFimBr) {
        fim = parseDataBr(dataFimBr)
    } else {
        fim = new Date(inicio)
        fim.setDate(fim.getDate() + (duracaoPadrao - 1))
    }
    
    const datasNoIntervalo = []
    let atual = new Date(inicio)
    
    while (atual <= fim) {
        datasNoIntervalo.push(formatarDataISO(atual))
        atual.setDate(atual.getDate() + 1)
    }
    
    return datasNoIntervalo
}