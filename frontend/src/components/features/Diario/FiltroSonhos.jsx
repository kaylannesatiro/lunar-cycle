import "./FiltroSonhos.css"
import { tagsPreCadastradas } from "../../../data/tagsData"
import { useFiltroLogica } from "../../../utils/useFiltroSonhos"
import Tag from "../../common/Tags/Tag"

const FiltroSonhos = ({tagsDoUsuario = [], onFilterChange}) => {
    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO', 'ESPECÍFICO']

    const {
        periodoSelecionado, setPeriodoSelecionado,
        tagsSelecionadas, listaCompletaDeTags,
        hoverLimpar, setHoverLimpar,
        dataInicio, dataFim, tagPeriodoEspecifico,
        lidarMudancaDataInicio, lidarMudancaDataFim,
        lidarComCliqueTag, lidarComLimpezaTags
    } = useFiltroLogica(tagsDoUsuario, tagsPreCadastradas, onFilterChange)

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

                        {tagPeriodoEspecifico && (
                            <Tag 
                                texto={tagPeriodoEspecifico}
                                variante="filtro-periodo"
                                ativa={periodoSelecionado === tagPeriodoEspecifico}
                                aoClicar={() => setPeriodoSelecionado(tagPeriodoEspecifico)}
                            />
                        )}
                    </div>

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