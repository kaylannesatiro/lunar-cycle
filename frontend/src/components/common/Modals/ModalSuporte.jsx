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
                    <div className="modal-conteudo-completo">
                        {dados.tituloPrincipal && (
                            <div className="modal-topo-centralizado">
                                {dados.exibirIcone && (
                                    <img src={IconeLua} alt="Ícone Lunar" className="modal-icone-destaque" />
                                )}
                                <h2 className="modal-titulo-principal">{dados.tituloPrincipal}</h2>
                                {dados.subtitulo && <h3 className="modal-subtitulo-topo">{dados.subtitulo}</h3>}
                            </div>
                        )}

                        {dados.textoPrincipal && (
                            <div className="modal-citacao-container">
                                {dados.iconeFrase && <span className="modal-icone-frase">{dados.iconeFrase}</span>}
                                <p className="modal-texto-principal">{dados.textoPrincipal}</p>
                            </div>
                        )}

                        {(dados.tituloContainer || dados.listaContainer || dados.textoSecundario) && (
                            <div className="modal-secao-secundaria">
                                {dados.tituloContainer && (
                                    <h4 className="modal-titulo-container">{dados.tituloContainer}</h4>
                                )}
                                
                                {dados.listaContainer && dados.listaContainer.length > 0 && (
                                    <ul className="modal-lista-container">
                                        {dados.listaContainer.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                                
                                {dados.textoSecundario && (
                                    <p className="modal-texto-secundario">{dados.textoSecundario}</p>
                                )}
                            </div>
                        )}

                        {(dados.fraseMistica || dados.copyright) && (
                            <div className="modal-rodape-interno">
                                {dados.fraseMistica && <p className="modal-frase-mistica">{dados.fraseMistica}</p>}
                                {dados.copyright && <p className="modal-copyright">{dados.copyright}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalSuporte;