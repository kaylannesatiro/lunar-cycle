import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ModalSonho.css";
import Button from "../../common/Buttons/Button";
import Input from "../../common/Inputs/Input";
import InputData from "../../common/Inputs/InputData";
import TextArea from "../../common/Inputs/TextArea";
import InputTags from "../../common/Tags/TagInput";

const TAGS_SUGERIDAS = ["lúcido", "recorrente", "profético", "simbólico", "espiritual", "transformação", "natureza", "voar", "água", "luz", "sombra", "amor", "medo", "paz", "magia"];

const ModalSonho = ({ isOpen, modo = "criar", dadosIniciais = {}, onSave, onFechar }) => {
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tags, setTags] = useState([]);
    const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (modo === "editar") {
            setTitulo(dadosIniciais.titulo || "");
            setData(dadosIniciais.data || "");
            setDescricao(dadosIniciais.descricao || "");
            setTags(dadosIniciais.tags || []);
            setTagsSelecionadas(dadosIniciais.tagsSelecionadas || []);
        } else {
            setTitulo("");
            setData("");
            setDescricao("");
            setTags([]);
            setTagsSelecionadas([]);
            setErros({});
        }
    }, [isOpen, modo]);

    const validar = () => {
        const novosErros = {};

        if (!titulo.trim() || titulo.trim().length < 3) {
            novosErros.titulo = "O título deve ter pelo menos 3 caracteres.";
        }
        if (titulo.length > 80) {
            novosErros.titulo = "O título pode ter no máximo 80 caracteres.";
        }
        if (!data.trim()) {
            novosErros.data = "Informe a data do sonho.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const aoSalvar = () => {
        if (!validar()) return;
        const dadosSonho = { titulo, data, descricao, tags, tagsSelecionadas };
        if (onSave) onSave(dadosSonho);
    };

    const adicionarTag = (novaTag) => {
        setTags([...tags, novaTag]);
    };

    const removerTag = (tagParaRemover) => {
        setTags(tags.filter((t) => t !== tagParaRemover));
    };

    const alternarTagSistema = (tag) => {
        if (tagsSelecionadas.includes(tag)) {
            setTagsSelecionadas(tagsSelecionadas.filter((t) => t !== tag));
        } else {
            setTagsSelecionadas([...tagsSelecionadas, tag]);
        }
    };

    const aoClicarOverlay = (e) => {
        if (e.target === e.currentTarget) {
            onFechar();
        }
    };

    const textoSubtitulo = modo === "editar" ? "Editar Sonho" : "Registrar Sonho";
    const textoBotao = modo === "editar" ? "✦ SALVAR ALTERAÇÕES" : "✦ SALVAR SONHO";

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
                        <div className="modal-sonho__fundo-gradiente" />

                        <div className="modal-sonho__cabecalho">
                            <div className="modal-sonho__titulo-area">
                                <span className="modal-sonho__supratitulo">✦ Diário Onírico</span>
                                <h2 className="modal-sonho__subtitulo">{textoSubtitulo}</h2>
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
                            <div className="modal-sonho__campo">
                                <label className="modal-sonho__label">Título do Sonho</label>
                                <Input
                                    variante="sonho"
                                    placeholder="O nome que o sonho merece…"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    error={erros.titulo}
                                />
                            </div>

                            <div className="modal-sonho__campo">
                                <label className="modal-sonho__label">Data</label>
                                <InputData
                                    variante="sonho"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    error={erros.data}
                                />
                            </div>

                            <div className="modal-sonho__campo">
                                <label className="modal-sonho__label">Narrativa do Sonho</label>
                                <TextArea
                                    placeholder="Descreva o que seu subconsciente revelou…"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    error={erros.descricao}
                                />
                            </div>

                            <div className="modal-sonho__campo">
                                <label className="modal-sonho__label">Essência</label>
                                <InputTags
                                    tags={tags}
                                    onAddTag={adicionarTag}
                                    onRemoveTag={removerTag}
                                    tagsDoSistema={TAGS_SUGERIDAS}
                                    tagsSelecionadas={tagsSelecionadas}
                                    onToggleTagSistema={alternarTagSistema}
                                />
                            </div>
                        </div>

                        <div className="modal-sonho__botao-container">
                            <Button variant="padrao" onClick={aoSalvar}>
                                {textoBotao}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalSonho;