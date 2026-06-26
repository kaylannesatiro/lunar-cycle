import { useState, useEffect } from "react"
import { tagsPreCadastradas } from "../../../data/tagsData"
import Tag from "../../common/Tags/Tag"
import "./FiltroSonhos.css"

const FiltroSonhos = ({tagsDoUsuario = [], onFilterChange}) => {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const [hoverLimpar, setHoverLimpar] = useState(false)
    const listaCompletaDeTags = [...new Set([...tagsPreCadastradas, ...tagsDoUsuario])]

    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [tagPeriodoEspecifico, setTagPeriodoEspecifico] = useState('') // Guarda o texto exato da tag gerada

    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO', 'PERÍODO ESPECÍFICO']

    const formatarDataBR = (dataString) => {
        if (!dataString) return ''
        const [ano, mes, dia] = dataString.split('-')
        return `${dia}/${mes}`
    }

    useEffect(() => {
        const todasAsTags = [...tagsPreCadastradas, ...tagsDoUsuario]
        const tagsSemRepeticao = [...new Set(todasAsTags)]
        setListaCompletaDeTags(tagsSemRepeticao)
    }, [tagsDoUsuario])

    useEffect(() => {
        if (dataInicio && dataFim) {
            const textoTag = `${formatarDataBR(dataInicio)} A ${formatarDataBR(dataFim)}`
            setTagPeriodoEspecifico(textoTag)
            setPeriodoSelecionado(textoTag)
        }
    }, [dataInicio, dataFim])

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
                onFilterChange({ periodo: periodoSelecionado, tags: [] })
            }
        }
    }

    const obterDatasFiltro = () => {
        if (periodoSelecionado === 'PERÍODO ESPECÍFICO' || periodoSelecionado === tagPeriodoEspecifico) {
            return { inicio: dataInicio, fim: dataFim }
        }
        return null
    }

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                periodo: periodoSelecionado,
                tags: tagsSelecionadas,
                datas: obterDatasFiltro()
            })
        }
    }, [periodoSelecionado, tagsSelecionadas, tagPeriodoEspecifico, dataInicio, dataFim, onFilterChange])

    return (
        <div className="filtro-sonhos-wrapper">
            <div className="filtro-sonhos-container">
                {/* FILTRO POR PERÍODO */}
                <div className="filtro-sonhos-grupo">
                    <div className="filtro-sonhos-cabecalho">
                        <h4 className="filtro-sonhos-titulo">FILTRAR POR PERÍODO</h4>
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
                    {(periodoSelecionado === 'PERÍODO ESPECÍFICO' || periodoSelecionado === tagPeriodoEspecifico) && (
                        <div className="filtro-sonhos-calendarios">
                            <div className="filtro-sonhos-campo-data">
                                <label>DE:</label>
                                <input 
                                    type="date" 
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="filtro-sonhos-input-data"
                                />
                            </div>
                            <div className="filtro-sonhos-campo-data">
                                <label>ATÉ:</label>
                                <input 
                                    type="date" 
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
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
                                texto="LIMPAR FILTROS" 
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