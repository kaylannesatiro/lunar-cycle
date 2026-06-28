import { useState } from "react"
import "./LinhaTempo.css"
import CardSonho from "../Diario/CardSonho"
import ModalVisualizarSonho from "../Modals/VisualizarSonho"

const LinhaTempo = ({ sonhosAgrupados = [], isLoading = false, onCardClick, mensagemVazia = "Seu diário ainda está em branco..." }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sonhoSelecionado, setSonhoSelecionado] = useState(null)

    const handleAbrirModal = (sonho) => {
        setSonhoSelecionado(sonho)
        setIsModalOpen(true)
        if (onCardClick) onCardClick(sonho.id)
    }

    const handleFecharModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSonhoSelecionado(null), 200)
    }

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
                    {mensagemVazia}
                </p>
            </div>
        );
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
                                    onClick={() => handleAbrirModal(sonho)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <ModalVisualizarSonho 
                isOpen={isModalOpen}
                sonho={sonhoSelecionado || {}}
                onFechar={handleFecharModal}
                onEditClick={() => console.log("Editar sonho:", sonhoSelecionado?.id)}
                onDeleteClick={() => console.log("Apagar sonho:", sonhoSelecionado?.id)}
            />
        </div>
    )
}

export default LinhaTempo