import { motion, AnimatePresence } from "framer-motion";
import { obterIconFaseDaLua } from "../../../data/fasesLua";
import "./VisualizarSonho.css";
import Button from "../../common/Buttons/Button";
import Tag from "../../common/Tags/Tag";

const ModalVisualizarSonho = ({ isOpen, sonho = {}, onEditClick, onDeleteClick, onFechar }) => {
    const fase = sonho.faseLunar || null;

    const aoClicarOverlay = (e) => {
        if (e.target === e.currentTarget) onFechar();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-sonho-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={aoClicarOverlay}
                >
                    <motion.div
                        className="modal-sonho"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="modal-sonho__gradiente" />

                        <div className="modal-sonho__cabecalho">
                            <div className="modal-sonho__cabecalho-esquerda">
                                {fase && (
                                    <div className="modal-sonho__icone-container">
                                        <img
                                            src={obterIconFaseDaLua(fase)} 
                                            alt={`Fase lunar: ${sonho.faseLunar}`}
                                            className="modal-sonho__icone-lua"
                                        />
                                    </div>
                                )}
                                <div className="modal-sonho__titulos">
                                    <span className="modal-sonho__fase-nome">
                                        {fase ? fase : "—"}
                                    </span>
                                    <span className="modal-sonho__data">
                                        {sonho.data || "—"}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="fechar"
                                onClick={onFechar}
                                backgroundColor="rgba(110, 76, 163, 0.3)"
                                color="rgba(165, 140, 255, 1)"
                            />
                        </div>

                        <div className="modal-sonho__divisor-container">
                            <div className="modal-sonho__divisor" />
                        </div>

                        <div className="modal-sonho__conteudo">
                            <div className="modal-sonho__conteudo-inner">

                                <span className="modal-sonho__aspas" aria-hidden="true">❝</span>

                                <h2 className="modal-sonho__titulo">{sonho.titulo || "Sem título"}</h2>

                                <p className="modal-sonho__descricao">{sonho.descricao || ""}</p>

                                <div className="modal-sonho__divisor-interno-container">
                                    <div className="modal-sonho__divisor-interno" />
                                </div>

                                {sonho.tags && sonho.tags.length > 0 && (
                                    <div className="modal-sonho__tags-container">
                                        <div className="modal-sonho__tags">
                                            {sonho.tags.map((tag, i) => (
                                                <Tag
                                                    key={i}
                                                    texto={tag}
                                                    variante="sonho"
                                                    ativa={true}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="modal-sonho__botoes">
                            <Button
                                variant="padrao"
                                onClick={onEditClick}
                                backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
                                color="rgba(165, 140, 255, 0.5)"
                                textColor="rgba(215, 204, 255, 1)"
                                width="100%" maxWidth="14.859rem"
                            >
                                ✎ Editar
                            </Button>

                            <Button
                                variant="padrao"
                                onClick={onDeleteClick} 
                                backgroundColor="rgba(88, 8, 16, 0.22)"
                                color="rgba(245, 240, 233, 0.5)"
                                textColor="rgba(245, 240, 233, 1)"
                                width="100%" maxWidth="14.859rem"
                            >
                                ✕ Apagar
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalVisualizarSonho;