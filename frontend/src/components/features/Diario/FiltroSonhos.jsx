import { useState, useEffect } from "react"
import { tagsPreCadastradas } from "../../../data/tagsData"
import Tag from "../../common/Tags/Tag"
import "./FiltroSonhos.css"

const FiltroSonhos = ({tagsDoUsuario = [], onFilterChange}) => {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO']
    const listaCompletaDeTags = [...new Set([...tagsPreCadastradas, ...tagsDoUsuario])]

    const lidarComCliqueTag = (tagClicada) => {
        setTagsSelecionadas((tagsAntigas) => {
            if (tagsAntigas.includes(tagClicada)) {
                return tagsAntigas.filter(t => t !== tagClicada)
            }
            return [...tagsAntigas, tagClicada]
        })
    }

    const lidarComLimpeza = () => {
        setTagsSelecionadas([]) // Zera as tags
        setPeriodoSelecionado('TODOS') // Volta o período para o padrão
        
        // Avisa o pai imediatamente que os filtros foram zerados
        if (onFilterChange) {
            onFilterChange({ periodo: 'TODOS', tags: [] })
        }
    }

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                periodo: periodoSelecionado,
                tags: tagsSelecionadas
            })
        }
    }, [periodoSelecionado, tagsSelecionadas, onFilterChange])

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
                    </div>
                </div>

                {/* FILTRO POR TAGS */}
                <div className="filtro-sonhos-grupo filtro-tags-margem">
                    <div className="filtro-sonhos-cabecalho">
                        <h4 className="filtro-sonhos-titulo">FILTRAR POR TAG</h4>
                        
                        {tagsSelecionadas.length > 0 && (
                            <Tag  
                                variante="filtro-periodo"
                                texto="LIMPAR"
                                className="filtro-sonhos-botao-limpar" 
                                aoClicar={lidarComLimpeza}
                                aria-label="Limpar todos os filtros"
                            />
                        )}
                    </div>

                    <div className="filtro-sonhos-lista-tags">
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