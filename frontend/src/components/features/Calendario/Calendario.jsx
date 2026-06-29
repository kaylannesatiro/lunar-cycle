import { obterIconFaseDaLua } from "../../../data/fasesLua";
import "./Calendario.css";

const clipPathsDasFases = {
    "Nova":             "circle(48% at 50% 50%)",
    "Cheia":            "circle(48% at 50% 50%)",
    "Crescente":        "ellipse(30% 48% at 65% 50%)",
    "Minguante":        "ellipse(30% 48% at 35% 50%)",
    "Quarto Crescente": "ellipse(48% 48% at 65% 50%)",
    "Quarto Minguante": "ellipse(48% 48% at 35% 50%)",
    "Gibosa Crescente": "ellipse(44% 48% at 55% 50%)",
    "Gibosa Minguante": "ellipse(44% 48% at 45% 50%)",
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

    const imagemDaFase = obterIconFaseDaLua(faseDaLua);
    const clipPath = clipPathsDasFases[faseDaLua] || "circle(48% at 50% 50%)";

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
            <div className="cal-dia__lua-container">
                <img
                    src={imagemDaFase}
                    alt={faseDaLua}
                    className="cal-dia__icone-lua"
                    style={{ clipPath: clipPath }}
                />
            </div>

        </div>
    );
};

const Calendario = ({ mesAtual, anoAtual, diasMenstruacao = [], diasPrevistos = [], fasesLunares = {}, onDayClick, onNextMonth, onPrevMonth }) => {
    const hoje = new Date();

    const totalDeDias = obterDiasNoMes(anoAtual, mesAtual);
    const diaInicialDaSemana = obterDiaDaSemanaInicial(anoAtual, mesAtual);

    const celulas = [];
    for (let i = 0; i < diaInicialDaSemana; i++) { celulas.push(null); }
    for (let dia = 1; dia <= totalDeDias; dia++) { celulas.push(dia); }

    const conjuntoMenstruacao = new Set(diasMenstruacao);
    const conjuntoPrevistos = new Set(diasPrevistos);

    return (
        <div className="cal-wrapper">
            <div className="cal-titulo-externo">
                <span>✦ Calendário Lunar ✦</span>
            </div>

            <div className="cal-container">
                <div className="cal-cabecalho">
                    <button className="cal-btn-nav" onClick={onPrevMonth} aria-label="Mês anterior">‹</button>
                    <div className="cal-mes-info">
                        <span className="cal-mes-nome">{NOMES_DOS_MESES[mesAtual].toUpperCase()}</span>
                        <span className="cal-mes-ano">{anoAtual}</span>
                    </div>
                    <button className="cal-btn-nav" onClick={onNextMonth} aria-label="Próximo mês">›</button>
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