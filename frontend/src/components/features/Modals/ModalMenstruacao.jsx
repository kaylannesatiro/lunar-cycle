import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ModalMenstruacao.css";
import Button from "../../common/Buttons/Button";
import InputData from "../../common/Inputs/InputData";

const ModalMenstruacao = ({ isOpen, modo = "registrar", dadosIniciais = {}, onSave, onDelete, onFechar }) => {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [mostrarDataFim, setMostrarDataFim] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (!isOpen) return;

        if (modo === "editar") {
            setDataInicio(dadosIniciais.dataInicio || "");
            setDataFim(dadosIniciais.dataFim || "");
            setMostrarDataFim(!!dadosIniciais.dataFim);
        } else {
            setDataInicio("");
            setDataFim("");
            setMostrarDataFim(false);
            setErros({});
        }
    }, [isOpen, modo]);

    const validar = () => {
        const novosErros = {};

        if (!dataInicio.trim()) {
            novosErros.dataInicio = "Informe a data de início.";
        }
        if (mostrarDataFim && !dataFim.trim()) {
            novosErros.dataFim = "Informe a data de fim ou remova o campo.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const aoSalvar = () => {
        if (!validar()) return;
        const dados = { dataInicio, dataFim: mostrarDataFim ? dataFim : "" };
        if (onSave) onSave(dados);
    };

    const aoApagar = () => {
        if (onDelete) onDelete();
    };

    const aoClicarOverlay = (e) => {
        if (e.target === e.currentTarget) onFechar();
    };

    const textoSubtitulo = modo === "editar" ? "Editar Menstruação" : "Registrar Menstruação";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-mens-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={aoClicarOverlay}
                >
                    <motion.div
                        className={`modal-mens modal-mens--${modo}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="modal-mens__gradiente" />

                        <div className="modal-mens__cabecalho">
                            <div className="modal-mens__titulo-area">
                                <span className="modal-mens__supratitulo">✦ Ciclo Lunar</span>
                                <h2 className="modal-mens__subtitulo">{textoSubtitulo}</h2>
                            </div>
                            <Button
                                variant="fechar"
                                onClick={onFechar}
                                backgroundColor="rgba(224, 197, 143, 0.06)"
                                color="rgba(224, 197, 143, 0.5)"
                            />
                        </div>

                        <div className="modal-mens__divisor-container">
                            <div className="modal-mens__divisor" />
                        </div>

                        <div className="modal-mens__conteudo">

                            <div className="modal-mens__campo">
                                <label className="modal-mens__label">Data de Início</label>
                                <InputData
                                    variante="menstruacao"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    error={erros.dataInicio}
                                />
                            </div>

                            {modo === "registrar" && !mostrarDataFim && (
                                <button
                                    type="button"
                                    className="modal-mens__btn-adicionar-fim"
                                    onClick={() => setMostrarDataFim(true)}
                                >
                                    ＋ Adicionar data de fim
                                </button>
                            )}

                            {mostrarDataFim && (
                                <div className="modal-mens__campo">
                                    <label className="modal-mens__label">Data de Fim</label>
                                    <InputData
                                        variante="menstruacao"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                        error={erros.dataFim}
                                    />
                                </div>
                            )}

                            <div className={`modal-mens__botoes ${modo === "editar" ? "modal-mens__botoes--editar" : ""}`}>

                                {modo === "editar" && (
                                    <Button
                                        variant="padrao"
                                        onClick={aoApagar}
                                        backgroundColor="rgba(120, 12, 22, 0.22)"
                                        color="rgba(245, 240, 233, 0.5)"
                                        textColor="rgba(245, 240, 233, 1)"
                                        width="6.808rem"
                                        maxWidth="6.808rem"
                                    >
                                        ✕ Apagar
                                    </Button>
                                )}

                                <Button
                                    variant="padrao"
                                    onClick={aoSalvar}
                                    backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                                    color="rgba(224, 197, 143, 0.5)"
                                    textColor="rgba(224, 197, 143, 1)"
                                    width={modo === "editar" ? "13.86rem" : "21.367rem"}
                                    maxWidth={modo === "editar" ? "13.86rem" : "21.367rem"}
                                >
                                    ◈ Salvar
                                </Button>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalMenstruacao;