import { useState } from "react";
import "./Calendario.css";
import imgLuaNova from "../../../assets/fases/lua-nova.svg";
import imgLuaCrescente from "../../../assets/fases/lua-crescente.svg";
import imgLuaCheia from "../../../assets/fases/lua-cheia.svg";
import imgLuaMinguante from "../../../assets/fases/lua-minguante.svg";
import imgLuaQuartoCrescente from "../../../assets/fases/lua-quarto-crescente.svg";
import imgLuaQuartoMinguante from "../../../assets/fases/lua-quarto-minguante.svg";
import imgLuaGibosaCrescente from "../../../assets/fases/lua-gibosa-crescente.svg";
import imgLuaGibosaMinguante from "../../../assets/fases/lua-gibosa-minguante.svg";

const imagensDasFases = {
    "Nova": imgLuaNova,
    "Crescente": imgLuaCrescente,
    "Quarto Crescente": imgLuaQuartoCrescente,
    "Gibosa Crescente": imgLuaGibosaCrescente,
    "Cheia": imgLuaCheia,
    "Minguante": imgLuaMinguante,
    "Quarto Minguante": imgLuaQuartoMinguante,
    "Gibosa Minguante": imgLuaGibosaMinguante,
};

const NOMES_DOS_MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_DA_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const IconeGota = () => (
    <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip-gota)">
            <path d="M3.50002 0.399902C3.50002 0.399902 0.400024 4.1999 0.400024 5.9999C0.400024 6.82207 0.726631 7.61057 1.30799 8.19193C1.88936 8.7733 2.67785 9.0999 3.50002 9.0999C4.3222 9.0999 5.11069 8.7733 5.69206 8.19193C6.27342 7.61057 6.60002 6.82207 6.60002 5.9999C6.60002 4.1999 3.50002 0.399902 3.50002 0.399902Z" fill="#BE2632" fillOpacity="0.95"/>
        </g>
        <defs>
            <clipPath id="clip-gota">
                <rect width="7" height="9" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

const formatarChaveData = (ano, mes, dia) => {
    const mesStr = String(mes + 1).padStart(2, "0");
    const diaStr = String(dia).padStart(2, "0");
    return `${ano}-${mesStr}-${diaStr}`;
};

const obterDiasNoMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

const obterDiaDaSemanaInicial = (ano, mes) => new Date(ano, mes, 1).getDay();
const DiaDoCalendario = ({ numeroDia, faseDaLua, estaMenstruada, estaPrevisto, eHoje, aoClicar }) => {

    let classeDoDia = "cal-dia";
    if (estaMenstruada) classeDoDia += " cal-dia--menstruacao";
    else if (estaPrevisto) classeDoDia += " cal-dia--previsto";
    if (eHoje) classeDoDia += " cal-dia--hoje";

    const imagemDaFase = imagensDasFases[faseDaLua] || imgLuaNova;

    return (
        <div className={classeDoDia} onClick={aoClicar}>

            {(estaMenstruada || estaPrevisto) && (
                <div className="cal-dia__topo">
                    <div className="cal-dia__icone-gota">
                        <IconeGota />
                    </div>
                </div>
            )}

            <span className="cal-dia__numero">{numeroDia}</span>

            <img
                src={imagemDaFase}
                alt={faseDaLua}
                className="cal-dia__icone-lua"
            />

        </div>
    );
};

const Calendario = ({ diasMenstruacao = [], diasPrevistos = [], fasesLunares = {}, onDayClick }) => {
    const hoje = new Date();
    const [mesAtual, setMesAtual] = useState(hoje.getMonth());
    const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

    const irParaProximoMes = () => {
        if (mesAtual === 11) {
            setMesAtual(0);
            setAnoAtual(anoAtual + 1);
        } else {
            setMesAtual(mesAtual + 1);
        }
    };

    const irParaMesAnterior = () => {
        if (mesAtual === 0) {
            setMesAtual(11);
            setAnoAtual(anoAtual - 1);
        } else {
            setMesAtual(mesAtual - 1);
        }
    };

    const totalDeDias = obterDiasNoMes(anoAtual, mesAtual);
    const diaInicialDaSemana = obterDiaDaSemanaInicial(anoAtual, mesAtual);

    const celulas = [];

    for (let i = 0; i < diaInicialDaSemana; i++) {
        celulas.push(null);
    }

    for (let dia = 1; dia <= totalDeDias; dia++) {
        celulas.push(dia);
    }

    const conjuntoMenstruacao = new Set(diasMenstruacao);
    const conjuntoPrevistos = new Set(diasPrevistos);

    return (
        <div className="cal-wrapper">
            <div className="cal-titulo-externo">
                <span>✦ Calendário Lunar ✦</span>
            </div>

            <div className="cal-container">

                <div className="cal-cabecalho">
                    <button className="cal-btn-nav" onClick={irParaMesAnterior} aria-label="Mês anterior">
                        ‹
                    </button>

                    <div className="cal-mes-info">
                        <span className="cal-mes-nome">{NOMES_DOS_MESES[mesAtual].toUpperCase()}</span>
                        <span className="cal-mes-ano">{anoAtual}</span>
                    </div>

                    <button className="cal-btn-nav" onClick={irParaProximoMes} aria-label="Próximo mês">
                        ›
                    </button>
                </div>

                <div className="cal-divisor" />

                <div className="cal-dias-semana">
                    {DIAS_DA_SEMANA.map((dia) => (
                        <span key={dia} className="cal-dia-semana-label">{dia}</span>
                    ))}
                </div>

                <div className="cal-grade">
                    {celulas.map((dia, index) => {
                        if (dia === null) {
                            return <div key={`vazio-${index}`} className="cal-dia cal-dia--vazio" />;
                        }

                        const chaveData = formatarChaveData(anoAtual, mesAtual, dia);

                        const estaMenstruada = conjuntoMenstruacao.has(chaveData);
                        const estaPrevisto = conjuntoPrevistos.has(chaveData);
                        const faseDaLua = fasesLunares[chaveData] || "Nova";

                        const eHoje =
                            dia === hoje.getDate() &&
                            mesAtual === hoje.getMonth() &&
                            anoAtual === hoje.getFullYear();

                        return (
                            <DiaDoCalendario
                                key={chaveData}
                                numeroDia={dia}
                                faseDaLua={faseDaLua}
                                estaMenstruada={estaMenstruada}
                                estaPrevisto={estaPrevisto}
                                eHoje={eHoje}
                                aoClicar={() => onDayClick && onDayClick(chaveData)}
                            />
                        );
                    })}
                </div>

                <div className="cal-footer">
                    <div className="cal-footer__container">
                        <div className="cal-legenda-item">
                            <IconeGota />
                            <span className="cal-legenda-texto">Menstruação</span>
                        </div>
                        <div className="cal-legenda-item cal-legenda-item--previsto">
                            <IconeGota />
                            <span className="cal-legenda-texto cal-legenda-texto--previsto">Previsão</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendario;