import { useEffect } from "react";
import "./ModalSuporte.css";
import IconeLua from "../../../assets/Icon-Modal.svg"; 

const ModalSuporte = ({ isOpen, onClose, dados }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !dados) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-caixa" onClick={(evento) => evento.stopPropagation()}>
                <button className="botao-fechar-absoluto" onClick={onClose} aria-label="Fechar">
                    X
                </button>

                <div className="modal-scroll-area">
                    <div className="modal-container-conteudo">
                        {dados.tituloPrincipal && (
                            <div className="modal-topo">
                                {dados.exibirIcone && (
                                    <img src={IconeLua} alt="Ícone Lunar" className="modal-icone-destaque" />
                                )}
                                
                                <h2 className="modal-titulo-principal">{dados.tituloPrincipal}</h2>
                                {dados.subtitulo && <h3 className="modal-subtitulo-topo">{dados.subtitulo}</h3>}
                            </div>
                        )}

                        <div className="modal-divisao-1"></div>

                        {dados.textoPrincipal && (
                            <div className="modal-citacao-container">
                                {dados.iconeFrase && (
                                    <div className="modal-icone-fixo-container">
                                        <span className="modal-icone-frase">{dados.iconeFrase}</span>
                                    </div>
                                )}

                                <p className="modal-texto-principal">{dados.textoPrincipal}</p>
                            </div>
                        )}

                        <div className="modal-divisao-2"></div>

                        {dados.textoSecundario && (
                            <p className="modal-texto-secundario">{dados.textoSecundario}</p>
                        )}

                        {dados.listaContainer && dados.listaContainer.length > 0 && (
                            <div className="modal-card-lista">
                                {dados.tituloContainer && (
                                    <h4 className="modal-titulo-lista">{dados.tituloContainer}</h4>
                                )}
                                
                                <ul className="modal-conteiner-lista-itens">
                                    {dados.listaContainer.map((item, index) => (
                                        <li key={index} className="modal-item-lista">
                                            <span style={{ color: '#E0C58F' }}>◈</span>
                                            <span className="modal-frase-item">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(dados.fraseMistica || dados.copyright) && (
                            <div className="modal-footer-container">
                                {dados.fraseMistica && <p className="modal-frase-mistica">{dados.fraseMistica}</p>}
                                {dados.copyright && <p className="modal-copyright">{dados.copyright}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalSuporte;