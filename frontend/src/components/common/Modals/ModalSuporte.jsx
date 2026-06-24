import  { useEffect } from "react";
import "./ModalSuporte.css";
import IconeLua from "../../../assets/Icon-Modal.svg"; 

const conteudosDosModais = {
    sobre: {
        conteudo: (
            <div className="modal-conteudo-completo">
                
                <div className="modal-topo-centralizado">
                    <img src={IconeLua} alt="Ícone Lunar" className="modal-icone-destaque" />
                    <h2 className="modal-titulo-principal">LUNAR CYCLE</h2>
                    <h3 className="modal-subtitulo-topo">VERSÃO 1.0.0</h3>
                </div>

                <div className="modal-citacao-container">
                    <span className="modal-icone-frase">❝</span>
                    <p className="modal-texto-principal">
                        Conecte-se aos ritmos sagrados do cosmos e sincronize sua jornada com os ciclos lunares. Lunar Cycle é seu portal místico para compreender e honrar as fases da natureza, entrelaçadas com a sabedoria milenar da Lua.
                    </p>
                </div>

                <div className="modal-secao-secundaria">
                    <h4 className="modal-titulo-container">RECURSOS MÍSTICOS</h4>
                    
                    <ul className="modal-lista-container">
                        <li>Calendário lunar interativo sincronizado com as fases da Lua</li>
                        <li>Registro e acompanhamento do ciclo menstrual</li>
                    </ul>
                    
                    <p className="modal-texto-secundario">
                        Acompanhe seus ciclos menstruais, registre seus sonhos noturnos, consulte o oráculo lunar e descubra a magia que existe em cada fase da sua jornada pessoal sob o brilho celestial da Lua.
                    </p>
                </div>

                <div className="modal-rodape-interno">
                    <p className="modal-frase-mistica">DESENVOLVIDO COM MAGIA LUNAR</p>
                    <p className="modal-copyright">© 2026 Lunar Cycle Todos os direitos reservados</p>
                </div>

            </div>
        )
    },
};

const ModalSuporte = ({ isOpen, onClose, contentType }) => {
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

    if (!isOpen) return null;

    const conteudoAtual = conteudosDosModais[contentType] || conteudosDosModais["sobre"];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-caixa" onClick={(evento) => evento.stopPropagation()}>
                
                <button className="botao-fechar-absoluto" onClick={onClose} aria-label="Fechar">
                    X
                </button>

                <div className="modal-scroll-area">
                    {conteudoAtual.conteudo ? conteudoAtual.conteudo : conteudoAtual.texto}
                </div>

            </div>
        </div>
    );
};

export default ModalSuporte;