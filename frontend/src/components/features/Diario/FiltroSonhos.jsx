import "./FiltroSonhos.css"
import { tagsPreCadastradas } from "../../../data/tagsData"
import { useFiltroLogica } from "../../../utils/useFiltroSonhos"
import Tag from "../../common/Tags/Tag"

const FiltroSonhos = ({tagsDoUsuario = [], dataPrimeiroSonho, onFilterChange}) => {
    const opcoesPeriodo = ['TODOS', 'SEMANA', 'MÊS', 'ANO', 'ESPECÍFICO']

    const {
        periodoSelecionado, tagsSelecionadas, listaCompletaDeTags, hoverLimpar, setHoverLimpar,
        dataInicio, dataFim, tagPeriodoEspecifico, menuAberto,
        lidarMudancaDataInicio, lidarMudancaDataFim, lidarComCliqueTag, lidarComLimpezaTags,
        lidarComCliquePeriodoMenu, lidarComSelecaoDropdown, obterOpcoesDropdown, isTagPeriodoAtiva
    } = useFiltroLogica(tagsDoUsuario, tagsPreCadastradas, onFilterChange, dataPrimeiroSonho)

    return (
        <div className="filtro-sonhos-wrapper">
            <div className="filtro-sonhos-container">
                {/* FILTRO POR PERÍODO */}
                <div className="filtro-sonhos-grupo">
                    <div className="filtro-sonhos-cabecalho">
                        <h4 className="filtro-sonhos-titulo">PERÍODO</h4>
                    </div>

                    <div className="filtro-sonhos-lista-tags">
                        {opcoesPeriodo.map((opcao) => {
                            const textoExibido = (opcao === 'ESPECÍFICO' && tagPeriodoEspecifico) 
                                ? tagPeriodoEspecifico 
                                : opcao

                            return (
                                <div key={opcao} className="filtro-sonhos-dropdown-wrapper">
                                    <Tag 
                                        texto={textoExibido} 
                                        variante="filtro-periodo"
                                        ativa={isTagPeriodoAtiva(opcao)}
                                        aoClicar={() => lidarComCliquePeriodoMenu(opcao)}
                                    />
                                    
                                    {menuAberto === opcao && (opcao === 'SEMANA' || opcao === 'MÊS' || opcao === 'ANO') && (
                                        <div className="filtro-sonhos-dropdown-lista">
                                            {obterOpcoesDropdown(opcao).map((itemHistorico) => (
                                                <button 
                                                    key={itemHistorico}
                                                    className={`filtro-sonhos-dropdown-item ${periodoSelecionado === itemHistorico ? 'ativo' : ''}`}
                                                    onClick={() => lidarComSelecaoDropdown(itemHistorico)}
                                                >
                                                    {itemHistorico}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {menuAberto === 'ESPECÍFICO' && opcao === 'ESPECÍFICO' && (
                                        <div className="filtro-sonhos-calendarios-dropdown">
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
                            )
                        })}
                    </div>
                </div>

                {/* FILTRO POR TAG */}
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
                            <Tag texto="LIMPAR" variante="filtro-tag" ativa={hoverLimpar && tagsSelecionadas.length > 0} aoClicar={lidarComLimpezaTags}/>
                        </div>

                        {listaCompletaDeTags.map((tag) => (
                            <Tag key={tag} texto={tag} variante="filtro-tag" ativa={tagsSelecionadas.includes(tag)} aoClicar={() => lidarComCliqueTag(tag)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FiltroSonhos