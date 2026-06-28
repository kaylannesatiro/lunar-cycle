import { motion, AnimatePresence } from "framer-motion";
import "./VisualizarSonho.css";
import Button from "../../common/Buttons/Button";
import Tag from "../../common/Tags/Tag";
import imgLuaNova from "../../../assets/fases/lua-nova.svg";
import imgLuaCrescente from "../../../assets/fases/lua-crescente.svg";
import imgLuaCheia from "../../../assets/fases/lua-cheia.svg";
import imgLuaMinguante from "../../../assets/fases/lua-minguante.svg";
import imgLuaQuartoCrescente from "../../../assets/fases/lua-quarto-crescente.svg";
import imgLuaQuartoMinguante from "../../../assets/fases/lua-quarto-minguante.svg";
import imgLuaGibosaCrescente from "../../../assets/fases/lua-gibosa-crescente.svg";
import imgLuaGibosaMinguante from "../../../assets/fases/lua-gibosa-minguante.svg";

const MAPA_FASES = {
    "lua-nova": { img: imgLuaNova, nome: "Lua Nova" },
    "lua-crescente": { img: imgLuaCrescente, nome: "Crescente" },
    "lua-cheia": { img: imgLuaCheia, nome: "Lua Cheia" },
    "lua-minguante": { img: imgLuaMinguante, nome: "Minguante" },
    "lua-quarto-crescente": { img: imgLuaQuartoCrescente, nome: "Quarto Crescente" },
    "lua-quarto-minguante": { img: imgLuaQuartoMinguante, nome: "Quarto Minguante" },
    "lua-gibosa-crescente": { img: imgLuaGibosaCrescente, nome: "Gibosa Crescente" },
    "lua-gibosa-minguante": { img: imgLuaGibosaMinguante, nome: "Gibosa Minguante" },
};

const ModalVisualizarSonho = ({ isOpen, sonho = {}, onEditClick, onDeleteClick, onFechar }) => {
    const fase = MAPA_FASES[sonho.faseId] || null;

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
                                            src={fase.img}
                                            alt={fase.nome}
                                            className="modal-sonho__icone-lua"
                                        />
                                    </div>
                                )}
                                <div className="modal-sonho__titulos">
                                    <span className="modal-sonho__fase-nome">
                                        {fase ? fase.nome : "—"}
                                    </span>
                                    <span className="modal-sonho__data">
                                        {sonho.dataFormatada || "—"}
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
                                                    variante="sonho-ativa"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-sonho__botoes">
                                    <Button
                                        variant="padrao"
                                        onClick={onEditClick}
                                        backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
                                        color="rgba(165, 140, 255, 0.5)"
                                        textColor="rgba(215, 204, 255, 1)"
                                        width="100%"
                                        maxWidth="14.859rem"
                                    >
                                        ✎ Editar
                                    </Button>

                                    <Button
                                        variant="padrao"
                                        onClick={onDeleteClick}
                                        backgroundColor="rgba(88, 8, 16, 0.22)"
                                        color="rgba(245, 240, 233, 0.5)"
                                        textColor="rgba(245, 240, 233, 1)"
                                        width="100%"
                                        maxWidth="14.859rem"
                                    >
                                        ✕ Apagar
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalVisualizarSonho;