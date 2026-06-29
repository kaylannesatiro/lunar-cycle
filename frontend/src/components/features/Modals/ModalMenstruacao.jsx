import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ModalMenstruacao.css";
import Button from "../../common/Buttons/Button";
import InputData from "../../common/Inputs/InputData";

const DIAS_POR_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const ModalMenstruacao = ({ isOpen, modo = "registrar", dadosIniciais = {}, onSave, onDelete, onFechar }) => {
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [mostrarDataFim, setMostrarDataFim] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        if (!isOpen) return;
        if (dadosIniciais && dadosIniciais.dataInicio) {
            setDataInicio(dadosIniciais.dataInicio);
            setDataFim(dadosIniciais.dataFim || "");
            setMostrarDataFim(!!dadosIniciais.dataFim);
        } else {
            setDataInicio("");
            setDataFim("");
            setMostrarDataFim(false);
        }
        
        setErros({});
    }, [isOpen, modo, dadosIniciais]);

    const eBissexto = (ano) => {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
    };

    const validarData = (valor) => {
        if (!valor || valor.length < 10) {
            return "Data incompleta. Use o formato DD/MM/AAAA.";
        }

        const partes = valor.split("/");
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);
        const ano = parseInt(partes[2], 10);

        if (mes < 1 || mes > 12) {
            return "Mês inválido. Informe um valor entre 01 e 12.";
        }

        if (ano < 1900 || ano > 2100) {
            return "Ano inválido. Informe um ano entre 1900 e 2100.";
        }

        let maxDias = DIAS_POR_MES[mes - 1];
        if (mes === 2 && eBissexto(ano)) {
            maxDias = 29;
        }

        if (dia < 1 || dia > maxDias) {
            return `Dia inválido. ${mes === 2
                ? `Fevereiro de ${ano} tem ${maxDias} dias.`
                : `O mês informado tem ${maxDias} dias.`}`;
        }

        const dataInformada = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataInformada > hoje) {
            return "A data não pode ser no futuro.";
        }

        return "";
    };

    const converterParaDate = (valor) => {
        const partes = valor.split("/");
        return new Date(
            parseInt(partes[2], 10),
            parseInt(partes[1], 10) - 1,
            parseInt(partes[0], 10)
        );
    };

    const validar = () => {
        const novosErros = {};

        if (!dataInicio.trim()) {
            novosErros.dataInicio = "Informe a data de início.";
        } else {
            const erroInicio = validarData(dataInicio);
            if (erroInicio) novosErros.dataInicio = erroInicio;
        }

        if (mostrarDataFim) {
            if (!dataFim.trim()) {
                novosErros.dataFim = "Informe a data de fim ou remova o campo.";
            } else {
                const erroFim = validarData(dataFim);
                if (erroFim) {
                    novosErros.dataFim = erroFim;
                } else if (!novosErros.dataInicio) {
                    const inicio = converterParaDate(dataInicio);
                    const fim = converterParaDate(dataFim);

                    if (fim < inicio) {
                        novosErros.dataFim = "A data de fim não pode ser anterior à data de início.";
                    }

                    if (fim.getTime() === inicio.getTime()) {
                        novosErros.dataFim = "A data de fim deve ser diferente da data de início.";
                    }
                }
            }
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
                                    onChange={(e) => {
                                        setDataInicio(e.target.value);
                                        if (erros.dataInicio) setErros({ ...erros, dataInicio: "" });
                                    }}
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
                                    <div className="modal-mens__label-row">
                                        <label className="modal-mens__label">Data de Fim</label>
                                        {modo === "registrar" && (
                                            <button
                                                type="button"
                                                className="modal-mens__btn-remover-fim"
                                                onClick={() => {
                                                    setMostrarDataFim(false);
                                                    setDataFim("");
                                                    if (erros.dataFim) setErros({ ...erros, dataFim: "" });
                                                }}
                                            >
                                                ✕ Remover
                                            </button>
                                        )}
                                    </div>
                                    <InputData
                                        variante="menstruacao"
                                        value={dataFim}
                                        onChange={(e) => {
                                            setDataFim(e.target.value);
                                            if (erros.dataFim) setErros({ ...erros, dataFim: "" });
                                        }}
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