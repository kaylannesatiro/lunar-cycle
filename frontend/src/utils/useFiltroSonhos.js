import { useState, useEffect } from "react"

const formatarDataBR = (dataString) => {
    if (!dataString) return ''
    const [, mes, dia] = dataString.split('-')
    return `${dia}/${mes}`
}

export const useFiltroLogica = (tagsDoUsuario, tagsPreCadastradas, onFilterChange, dataPrimeiroSonho) => {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const [hoverLimpar, setHoverLimpar] = useState(false)
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [menuAberto, setMenuAberto] = useState(null) 

    const tagsPadraoSeguras = tagsPreCadastradas || []
    const tagsUsuarioSeguras = tagsDoUsuario || []
    const listaCompletaDeTags = [...new Set([...tagsPadraoSeguras, ...tagsUsuarioSeguras])]

    const tagPeriodoEspecifico = (dataInicio && dataFim) 
        ? `${formatarDataBR(dataInicio)} A ${formatarDataBR(dataFim)}` 
        : ''

    const obterOpcoesDropdown = (tipo) => {
        const hoje = new Date()
        const inicio = dataPrimeiroSonho 
            ? new Date(dataPrimeiroSonho) 
            : new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate())
            
        let opcoes = []

        if (tipo === 'ANO') {
            for (let ano = hoje.getFullYear(); ano >= inicio.getFullYear(); ano--) {
                opcoes.push(ano.toString())
            }
        } else if (tipo === 'MÊS') {
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            let dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
            let dataLimite = new Date(inicio.getFullYear(), inicio.getMonth(), 1)
            
            while (dataAtual >= dataLimite) {
                opcoes.push(`${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`)
                dataAtual.setMonth(dataAtual.getMonth() - 1)
            }
        } else if (tipo === 'SEMANA') {
            let fim = new Date(hoje)
            let dataLimite = new Date(inicio)
            
            let totalSemanas = 0
            while (fim >= dataLimite && totalSemanas < 52) {
                let inicioSemana = new Date(fim)
                inicioSemana.setDate(inicioSemana.getDate() - 6)
                
                const strInicio = `${String(inicioSemana.getDate()).padStart(2, '0')}/${String(inicioSemana.getMonth() + 1).padStart(2, '0')}`
                const strFim = `${String(fim.getDate()).padStart(2, '0')}/${String(fim.getMonth() + 1).padStart(2, '0')}`
                
                opcoes.push(`${strInicio} a ${strFim}`)
                
                fim.setDate(fim.getDate() - 7)
                totalSemanas++
            }
        }
        return opcoes
    }

    const isTagPeriodoAtiva = (opcao) => {
        if (opcao === 'TODOS' && periodoSelecionado === 'TODOS') return true
        if (opcao === 'ESPECÍFICO') {
            return periodoSelecionado === 'ESPECÍFICO' || (tagPeriodoEspecifico && periodoSelecionado === tagPeriodoEspecifico)
        }
        if (opcao === 'SEMANA' || opcao === 'MÊS' || opcao === 'ANO') {
            return obterOpcoesDropdown(opcao).includes(periodoSelecionado)
        }
        return false
    }

    const lidarComCliquePeriodoMenu = (opcao) => {
        if (opcao === 'TODOS') {
            setPeriodoSelecionado('TODOS')
            setDataInicio('') 
            setDataFim('') 
            setMenuAberto(null)
        } else {
            setMenuAberto(menuAberto === opcao ? null : opcao)
        }
    }

    const lidarComSelecaoDropdown = (valorFinal) => {
        setPeriodoSelecionado(valorFinal)
        setMenuAberto(null) 
    }

    const lidarMudancaDataInicio = (e) => {
        const novaData = e.target.value
        setDataInicio(novaData)
        if (novaData && dataFim) {
            setPeriodoSelecionado(`${formatarDataBR(novaData)} A ${formatarDataBR(dataFim)}`)
            setMenuAberto(null) 
        }
    }

    const lidarMudancaDataFim = (e) => {
        const novaData = e.target.value
        setDataFim(novaData)
        if (dataInicio && novaData) {
            setPeriodoSelecionado(`${formatarDataBR(dataInicio)} A ${formatarDataBR(novaData)}`)
            setMenuAberto(null) 
        }
    }

    const lidarComCliqueTag = (tagClicada) => {
        setTagsSelecionadas((tagsAntigas) => tagsAntigas.includes(tagClicada) ? tagsAntigas.filter(t => t !== tagClicada) : [...tagsAntigas, tagClicada])
    }

    const lidarComLimpezaTags = () => {
        if (tagsSelecionadas.length > 0) {
            setTagsSelecionadas([])
            setHoverLimpar(false)
            if (onFilterChange) onFilterChange({ periodo: periodoSelecionado, tags: [], datas: null })
        }
    }

    useEffect(() => {
        if (onFilterChange) {
            let datasSelecionadas = null
            if (periodoSelecionado === 'ESPECÍFICO' || (tagPeriodoEspecifico && periodoSelecionado === tagPeriodoEspecifico)) {
                datasSelecionadas = { inicio: dataInicio, fim: dataFim }
            }
            onFilterChange({ periodo: periodoSelecionado, tags: tagsSelecionadas, datas: datasSelecionadas })
        }
    }, [periodoSelecionado, tagsSelecionadas, dataInicio, dataFim, tagPeriodoEspecifico, onFilterChange])

    return {
        periodoSelecionado, tagsSelecionadas, listaCompletaDeTags, hoverLimpar, setHoverLimpar,
        dataInicio, dataFim, tagPeriodoEspecifico, menuAberto,
        lidarMudancaDataInicio, lidarMudancaDataFim, lidarComCliqueTag, lidarComLimpezaTags,
        lidarComCliquePeriodoMenu, lidarComSelecaoDropdown, obterOpcoesDropdown, isTagPeriodoAtiva
    }
}