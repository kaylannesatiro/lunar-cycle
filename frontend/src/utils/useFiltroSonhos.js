import { useState, useEffect } from "react"

const formatarDataBR = (dataString) => {
    if (!dataString) return ''
    const [, mes, dia] = dataString.split('-') 
    return `${dia}/${mes}`
}

export const useFiltroLogica = (tagsDoUsuario, tagsPreCadastradas, onFilterChange) => {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const [hoverLimpar, setHoverLimpar] = useState(false)
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const tagsPadraoSeguras = tagsPreCadastradas || []
    const tagsUsuarioSeguras = tagsDoUsuario || []
    const listaCompletaDeTags = [...new Set([...tagsPadraoSeguras, ...tagsUsuarioSeguras])]

    const tagPeriodoEspecifico = (dataInicio && dataFim) 
        ? `${formatarDataBR(dataInicio)} A ${formatarDataBR(dataFim)}` 
        : ''

    const lidarMudancaDataInicio = (e) => {
        const novaData = e.target.value
        setDataInicio(novaData)
        if (novaData && dataFim) {
            setPeriodoSelecionado(`${formatarDataBR(novaData)} A ${formatarDataBR(dataFim)}`)
        }
    }

    const lidarMudancaDataFim = (e) => {
        const novaData = e.target.value
        setDataFim(novaData)
        if (dataInicio && novaData) {
            setPeriodoSelecionado(`${formatarDataBR(dataInicio)} A ${formatarDataBR(novaData)}`)
        }
    }

    const lidarComCliqueTag = (tagClicada) => {
        setTagsSelecionadas((tagsAntigas) => {
            if (tagsAntigas.includes(tagClicada)) {
                return tagsAntigas.filter(t => t !== tagClicada)
            }
            return [...tagsAntigas, tagClicada]
        })
    }

    const lidarComLimpezaTags = () => {
        if (tagsSelecionadas.length > 0) {
            setTagsSelecionadas([])
            setHoverLimpar(false)
            
            if (onFilterChange) {
                let datasAtuais = null
                if (periodoSelecionado === 'ESPECÍFICO' || periodoSelecionado === tagPeriodoEspecifico) {
                    datasAtuais = { inicio: dataInicio, fim: dataFim }
                }
                onFilterChange({ periodo: periodoSelecionado, tags: [], datas: datasAtuais })
            }
        }
    }

    useEffect(() => {
        if (onFilterChange) {
            let datasSelecionadas = null
            if (periodoSelecionado === 'ESPECÍFICO' || (tagPeriodoEspecifico && periodoSelecionado === tagPeriodoEspecifico)) {
                datasSelecionadas = { inicio: dataInicio, fim: dataFim }
            }
            onFilterChange({
                periodo: periodoSelecionado,
                tags: tagsSelecionadas,
                datas: datasSelecionadas
            })
        }
    }, [periodoSelecionado, tagsSelecionadas, dataInicio, dataFim, tagPeriodoEspecifico, onFilterChange])

    return {
        periodoSelecionado, setPeriodoSelecionado,
        tagsSelecionadas,
        listaCompletaDeTags,
        hoverLimpar, setHoverLimpar,
        dataInicio, dataFim,
        tagPeriodoEspecifico,
        lidarMudancaDataInicio, lidarMudancaDataFim,
        lidarComCliqueTag, lidarComLimpezaTags
    }
}