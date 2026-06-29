import { obterIconFaseDaLua } from "../../../data/fasesLua";
import "./Calendario.css";

const calcularFaseDaLuaLocal = (ano, mes, dia) => {
    const data = new Date(ano, mes, dia);
    const CICLO_LUNAR_DIAS = 29.530588853;
    const CICLO_LUNAR_MS = CICLO_LUNAR_DIAS * 24 * 60 * 60 * 1000;
    const LUA_NOVA_REFERENCIA = new Date('2000-01-06T18:14:00Z').getTime();
    
    const tempoDecorrido = data.getTime() - LUA_NOVA_REFERENCIA;
    let diasDoCiclo = (tempoDecorrido % CICLO_LUNAR_MS) / (24 * 60 * 60 * 1000);
    
    if (diasDoCiclo < 0) diasDoCiclo += CICLO_LUNAR_DIAS;
    
    const indice = Math.floor(((diasDoCiclo + (CICLO_LUNAR_DIAS / 16)) / CICLO_LUNAR_DIAS) * 8) % 8;
    
    const fases = [
        "Nova", 
        "Crescente",
        "Quarto Crescente", 
        "Gibosa Crescente", 
        "Cheia", 
        "Gibosa Minguante", 
        "Quarto Minguante", 
        "Minguante"
    ];
    
    return fases[indice];
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
        
            {imagemDaFase && (
                <div className="cal-dia__lua-container">
                    <img
                        src={imagemDaFase}
                        alt={faseDaLua}
                        className="cal-dia__icone-lua"
                    />
                </div>
            )}
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
                        const faseDaLua = calcularFaseDaLuaLocal(anoAtual, mesAtual, dia);
                        
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