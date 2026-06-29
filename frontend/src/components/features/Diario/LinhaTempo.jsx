import { useState } from "react"
import "./LinhaTempo.css"
import CardSonho from "../Diario/CardSonho"
import ModalVisualizarSonho from "../Modals/VisualizarSonho"
import PopupConfirmacao from "../../common/Modals/PopupConfirmacao"
import ModalSonho from "../Modals/ModalSonho"
import Button from "../../common/Buttons/Button"

const LinhaTempo = ({ sonhosAgrupados = [], isLoading = false, tagsDaUsuaria = [], onCardClick, onEditarSonho, onDeletarSonho, mensagemVazia = "Volte a sonhar e registre aqui suas aventuras noturnas..." }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPopupApagarAberto, setIsPopupApagarAberto] = useState(false)
    const [isModalEditarAberto, setIsModalEditarAberto] = useState(false)
    const [sonhoSelecionado, setSonhoSelecionado] = useState(null)

    const handleAbrirModal = (sonho) => {
        setSonhoSelecionado(sonho)
        setIsModalOpen(true)
        if (onCardClick) onCardClick(sonho.id)
    };

    const handleFecharModalVisualizar = () => {
        setIsModalOpen(false)
        setTimeout(() => setSonhoSelecionado(null), 200)
    };

    const handleFecharTodos = () => {
        setIsModalOpen(false)
        setIsModalEditarAberto(false)
        setIsPopupApagarAberto(false)
        setTimeout(() => setSonhoSelecionado(null), 200)
    }

    const handleAbrirEdicao = () => {
        setIsModalOpen(false)
        setTimeout(() => setIsModalEditarAberto(true), 200)
    }

    const handleAbrirConfirmacaoApagar = () => {
        setIsModalOpen(false)
        setTimeout(() => setIsPopupApagarAberto(true), 200)
    }

    const handleConfirmarDelete = () => {
        if (onDeletarSonho && sonhoSelecionado) {
            onDeletarSonho(sonhoSelecionado.id)
        }
        handleFecharTodos()
    }

    const handleSalvarEdicao = (dadosEditados) => {
        if (onEditarSonho && sonhoSelecionado) {
            onEditarSonho({ id: sonhoSelecionado.id, ...dadosEditados })
        }
        handleFecharTodos()
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
                <p className="linha-tempo-mensagem">{mensagemVazia}</p>
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
                onFechar={handleFecharModalVisualizar}
                onEditClick={handleAbrirEdicao}
                onDeleteClick={handleAbrirConfirmacaoApagar} 
            />

            <ModalSonho 
                isOpen={isModalEditarAberto}
                modo="editar" 
                dadosIniciais={sonhoSelecionado || {}}
                tagsDaUsuaria={tagsDaUsuaria} 
                onFechar={handleFecharTodos}
                onSave={handleSalvarEdicao} 
            />

            <PopupConfirmacao
                isOpen={isPopupApagarAberto}
                variante="perigo"
                title="Confirmar Exclusão"
                message={`Você tem certeza que deseja apagar o sonho "${sonhoSelecionado?.titulo}"? Essa ação não pode ser desfeita.`}
                backgroundColor="radial-gradient(111.8% 111.8% at 50% 0%, rgba(150, 22, 32, 0.08) 0%, rgba(0, 0, 0, 0.00) 58%)"
                textColor="#D7CCFF"
                onCancel={() => setIsPopupApagarAberto(false)}
                botaoCancelar={<Button variant="padrao" width="160px" backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)" color="#A58CFF" textColor="#D7CCFF" onClick={() => setIsPopupApagarAberto(false)}>Cancelar</Button>}
                botaoConfirmar={<Button variant="padrao" width="180px" backgroundColor="rgba(88, 8, 16, 0.22)" color="rgba(245, 240, 233, 0.50)" textColor="#F5F0E9" onClick={handleConfirmarDelete}>Apagar Sonho</Button>}
            />
        </div>
    )
}

export default LinhaTempo