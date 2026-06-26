import "./LinhaTempo.css"
import CardSonho from "../Diario/CardSonho"

const LinhaTempo = ({ sonhosAgrupados = [], isLoading = false, onCardClick }) => {
    if (isLoading) {
        return (
            <div className="linha-tempo-vazia">
                <p className="linha-tempo-mensagem">Consultando os astros...</p>
            </div>
        )
    }

    if (!isLoading && sonhosAgrupados.length === 0) {
        return (
            <div className="linha-tempo-vazia">
                <p className="linha-tempo-mensagem">
                    Seu diário ainda está em branco. Volte a dormir, sonhe e registre sua primeira jornada.
                </p>
            </div>
        )
    }
    
    return (
        <div className="linha-tempo-pai">
            <div className="linha-tempo-conteudo">
                {sonhosAgrupados.map((grupo) => (
                    <div key={`${grupo.mes}-${grupo.ano}`} className="linha-tempo-grupo">
                        <div className="linha-tempo-cabecalho">
                            <div className="linha-tempo-divisor-esq"></div>
                            <div className="linha-tempo-titulo-wrapper">
                                <h2 className="linha-tempo-mes">{grupo.mes}</h2>
                                <span className="linha-tempo-ano">{grupo.ano}</span>
                            </div>
                            <div className="linha-tempo-divisor-dir"></div>
                        </div>

                        <div className="linha-tempo-cards-container">
                            <div className="linha-tempo-trilha"></div>
                            
                            {grupo.itens.map((sonho) => (
                                <CardSonho 
                                    key={sonho.id}
                                    faseLunar={sonho.faseLunar}
                                    data={sonho.diaFormatado}
                                    titulo={sonho.titulo}
                                    tags={sonho.tags}
                                    onClick={() => onCardClick && onCardClick(sonho.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LinhaTempo