import { useState, useEffect } from "react"
import { tagsPreCadastradas } from "../../../data/tagsData"
import Tag from "../../common/Tags/Tag"
import "./FiltroSonhos.css"

const FiltroSonhos = ({onFilterChange}) => {

    const [periodoSelecionado, setPeriodoSelecionado] = useState('TODOS')
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO']

    const lidarComCliqueTag = (tagClicada) => {
        setTagsSelecionadas((tagsAntigas) => {
            if (tagsAntigas.includes(tagClicada)) {
                return tagsAntigas.filter(t => t !== tagClicada)
            }
            return [...tagsAntigas, tagClicada]
        })
    }

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                periodo: periodoSelecionado,
                tags: tagsSelecionadas
            });
        }
    }, [periodoSelecionado, tagsSelecionadas, onFilterChange]);

    return (
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
                </div>

                <div className="filtro-sonhos-lista-tags">
                    {tagsDisponiveis.map((tag) => (
                        <Tag 
                            key={tag} 
                            texto={tag} 
                            variante="filtro-tag"
                            ativa={tagsSelecionadas.includes(tag)} 
                            aoClicar={() => lidarComCliqueTag(tag)}
                        />
                    ))}
                    
                    {tagsDisponiveis.length === 0 && (
                        <span className="filtro-sonhos-vazio">Nenhuma tag encontrada</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FiltroSonhos