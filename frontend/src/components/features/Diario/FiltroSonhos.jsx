import { useState, useEffect } from "react"
import { tagsPreCadastradas } from "../../../data/tagsData"
import Tag from "../../common/Tags/Tag"
import "./FiltroSonhos.css"

const FiltroSonhos = ({tagsDoUsuario = [], onFilterChange}) => {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const [hoverLimpar, setHoverLimpar] = useState(false)
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO', 'ESPECÍFICO']

    const tagsPadraoSeguras = tagsPreCadastradas || []
    const tagsUsuarioSeguras = tagsDoUsuario || []
    const listaCompletaDeTags = [...new Set([...tagsPadraoSeguras, ...tagsUsuarioSeguras])]

    const formatarDataBR = (dataString) => {
        if (!dataString) return ''
        const [, mes, dia] = dataString.split('-')
        return `${dia}/${mes}`
    }

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

    return (
        <div className="filtro-sonhos-wrapper">
            <div className="filtro-sonhos-container">
                {/* FILTRO POR PERÍODO */}
                <div className="filtro-sonhos-grupo">
                    <div className="filtro-sonhos-cabecalho">
                        <h4 className="filtro-sonhos-titulo">PERÍODO</h4>
                    </div>

                    <div className="filtro-sonhos-lista-tags">
                        {opcoesPeriodo.map((opcao) => (
                            <Tag 
                                key={opcao} 
                                texto={opcao} 
                                variante="filtro-periodo"
                                ativa={periodoSelecionado === opcao}
                                aoClicar={() => setPeriodoSelecionado(opcao)}
                            />
                        ))}

                        {/* TAG CALENDÁRIO */}
                        {tagPeriodoEspecifico && (
                            <Tag 
                                texto={tagPeriodoEspecifico}
                                variante="filtro-periodo"
                                ativa={periodoSelecionado === tagPeriodoEspecifico}
                                aoClicar={() => setPeriodoSelecionado(tagPeriodoEspecifico)}
                            />
                        )}
                    </div>

                    {/* CALENDÁRIO CONDICIONAL */}
                    {(periodoSelecionado === 'ESPECÍFICO' || periodoSelecionado === tagPeriodoEspecifico) && (
                        <div className="filtro-sonhos-calendarios">
                            <div className="filtro-sonhos-campo-data">
                                <label>DE:</label>
                                <input 
                                    type="date" 
                                    value={dataInicio}
                                    onChange={lidarMudancaDataInicio}
                                    className="filtro-sonhos-input-data"
                                />
                            </div>

                            <div className="filtro-sonhos-campo-data">
                                <label>ATÉ:</label>
                                <input 
                                    type="date" 
                                    value={dataFim}
                                    onChange={lidarMudancaDataFim}
                                    className="filtro-sonhos-input-data"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* FILTRO POR TAGS */}
                <div className="filtro-sonhos-grupo filtro-tags-margem">
                    <div className="filtro-sonhos-cabecalho">
                        <h4 className="filtro-sonhos-titulo">FILTRAR POR TAG</h4>
                    </div>

                    <div className="filtro-sonhos-lista-tags">
                        <div 
                            className={`container-tag-limpar ${tagsSelecionadas.length === 0 ? 'tag-limpar--desativada' : ''}`}
                            onMouseEnter={() => setHoverLimpar(true)}
                            onMouseLeave={() => setHoverLimpar(false)}
                        >
                            <Tag 
                                texto="LIMPAR" 
                                variante="filtro-tag"
                                ativa={hoverLimpar && tagsSelecionadas.length > 0} 
                                aoClicar={lidarComLimpezaTags}
                            />
                        </div>

                        {listaCompletaDeTags.map((tag) => (
                            <Tag 
                                key={tag} 
                                texto={tag} 
                                variante="filtro-tag"
                                ativa={tagsSelecionadas.includes(tag)} 
                                aoClicar={() => lidarComCliqueTag(tag)}
                            />
                        ))}
                        
                        {listaCompletaDeTags.length === 0 && (
                            <span className="filtro-sonhos-vazio">Nenhuma tag encontrada</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FiltroSonhos