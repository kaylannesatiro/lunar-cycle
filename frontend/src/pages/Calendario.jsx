import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"

import Button from "../components/common/Buttons/Button"
import Calendario from "../components/features/Calendario/Calendario"
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao"
import "./Calendario.css"

// ==========================================
// FUNÇÕES AUXILIARES DE DATA (Para o truque do Frontend)
// ==========================================

// Converte de "DD/MM/YYYY" para objeto Date
const parseDataBr = (dataStr) => {
    if (!dataStr) return new Date();
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(ano, mes - 1, dia);
};

// Converte objeto Date para "YYYY-MM-DD" (Formato do Backend)
const formatarDataISO = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

// Gera um array com todos os dias entre uma data inicial e final
// Gera um array com todos os dias entre uma data inicial e final
const gerarIntervaloDeDatas = (dataInicioBr, dataFimBr, duracaoConfigurada) => {
    const inicio = parseDataBr(dataInicioBr);
    let fim;
    
    if (dataFimBr) {
        // Se ela preencheu a data fim no modal, obedece o que ela digitou
        fim = parseDataBr(dataFimBr);
    } else {
        // A MÁGICA AQUI: Se ela só colocou o início, o sistema soma os dias da configuração!
        // Subtraímos 1 porque o próprio dia de início já conta como 1 dia de sangramento.
        fim = new Date(inicio);
        fim.setDate(fim.getDate() + (duracaoConfigurada - 1));
    }
    
    const datasNoIntervalo = [];
    let atual = new Date(inicio);
    
    while (atual <= fim) {
        datasNoIntervalo.push(formatarDataISO(atual));
        atual.setDate(atual.getDate() + 1);
    }
    
    return datasNoIntervalo;
};


const CalendarioPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    // Controle do Modal
    const [modalModo, setModalModo] = useState("registrar")
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({})

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    useEffect(() => {
        const carregarCalendarioInicial = async () => {
            try {
                setIsLoading(true)
                const dadosBrutos = await cicloService.obterCalendario(mesFiltro, anoFiltro)
                setDadosCalendario(dadosBrutos)
            } catch (error) {
                console.error("Erro ao sincronizar dados com a órbita lunar:", error)
            } finally {
                setIsLoading(false)
            }
        }
        carregarCalendarioInicial()
    }, [])

    useEffect(() => {
        const atualizarMesCalendario = async () => {
            try {
                const dadosMes = await cicloService.obterCalendario(mesFiltro, anoFiltro)
                setDadosCalendario(dadosMes)
            } catch (error) {
                console.error("Erro ao transicionar mês lunar:", error)
            }
        }
        if (!isLoading) atualizarMesCalendario()
    }, [mesFiltro, anoFiltro])

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
        }
    }, [isModalOpen])

    const diasMenstruacaoFormatados = dadosCalendario.dias
        .filter(d => d.registrada)
        .map(d => d.data.split('T')[0])

    const diasPrevistosFormatados = dadosCalendario.dias
        .filter(d => d.prevista)
        .map(d => d.data.split('T')[0])

    // ==========================================
    // LÓGICA DO CLIQUE NO DIA
    // ==========================================
    const handleDayClick = (dataStrISO) => {
        // dataStrISO vem como "YYYY-MM-DD"
        const isRegistrada = diasMenstruacaoFormatados.includes(dataStrISO);
        
        // Converte para "DD/MM/YYYY" para preencher o Input do Modal
        const [ano, mes, dia] = dataStrISO.split('-');
        const dataFormatadaModal = `${dia}/${mes}/${ano}`;

        setModalModo(isRegistrada ? "editar" : "registrar");
        setDadosIniciaisModal({ dataInicio: dataFormatadaModal, dataFim: "" });
        setIsModalOpen(true);
    };

    // ==========================================
    // LÓGICA DE SALVAR SEM MEXER NO BACKEND
    // ==========================================
    const handleSalvarModal = async (dadosDoModal) => {
        try {
            const diasAlvo = gerarIntervaloDeDatas(dadosDoModal.dataInicio, dadosDoModal.dataFim);
            const diasParaMarcar = diasAlvo.filter(diaISO => !diasMenstruacaoFormatados.includes(diaISO));
            
            // Se já estava tudo marcado, só fecha o modal
            if (diasParaMarcar.length === 0) {
                setIsModalOpen(false);
                return;
            }

            let ultimoCalendario = dadosCalendario;

            for (const diaISO of diasParaMarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro);
                ultimoCalendario = resposta.calendario;
            }

            setDadosCalendario(ultimoCalendario);
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("ERRO GRAVE AO SALVAR:", error);
            alert("🚨 O BACKEND RECUSOU! Aperte F12 e olhe o Console ou o terminal do seu Node.");
        }
    };

    // ==========================================
    // LÓGICA DE APAGAR SEM MEXER NO BACKEND
    // ==========================================
    const handleApagarModal = async () => {
        try {
            const diasAlvo = gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim);
            
            // Pega apenas os dias alvo que ESTÃO marcados no banco (para podermos "desligá-los")
            const diasParaDesmarcar = diasAlvo.filter(diaISO => diasMenstruacaoFormatados.includes(diaISO));
            
            let ultimoCalendario = dadosCalendario;

            for (const diaISO of diasParaDesmarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro);
                ultimoCalendario = resposta.calendario;
            }

            setDadosCalendario(ultimoCalendario);
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("Erro ao apagar período menstrual em lote:", error);
        }
    };

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova";
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente";
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante";
        return nomeFaseBackend;
    };

    const dicionarioFasesLunares = dadosCalendario.dias.reduce((acc, d) => {
        const dataLimpa = d.data.split('T')[0];
        acc[dataLimpa] = normalizarFaseParaComponente(d.faseLunar?.nome);
        return acc;
    }, {});

    if (isLoading) return <div className="cal-page-loading">Sintonizando marés e ciclos lunares...</div>

    return (
        <div className="cal-page-shell">
            <main className="cal-page-main-content">
                <Calendario 
                    mesAtual={mesFiltro - 1}
                    anoAtual={anoFiltro}
                    diasMenstruacao={diasMenstruacaoFormatados}
                    diasPrevistos={diasPrevistosFormatados}
                    fasesLunares={dicionarioFasesLunares}
                    onDayClick={handleDayClick}
                    onNextMonth={() => {
                        if (mesFiltro === 12) {
                            setMesFiltro(1); setAnoFiltro(ano => ano + 1)
                        } else setMesFiltro(m => m + 1)
                    }}
                    onPrevMonth={() => {
                        if (mesFiltro === 1) {
                            setMesFiltro(12); setAnoFiltro(ano => ano - 1)
                        } else setMesFiltro(m => m - 1)
                    }}
                />

                <div className="cal-page-action-area">
                    <Button 
                        variant="redondo"
                        maxWidth="280px"
                        backgroundColor="transparent"
                        color="rgba(224, 197, 143, 0.40)"
                        textColor="#E0C58F"
                        style={{ border: "1px solid #E0C58F" }}
                        onClick={() => {
                            setModalModo("registrar");
                            setDadosIniciaisModal({ dataInicio: "", dataFim: "" });
                            setIsModalOpen(true);
                        }}
                    >
                        ◈ Registrar Menstruação
                    </Button>
                </div>
            </main>

            <ModalMenstruacao 
                isOpen={isModalOpen}
                modo={modalModo}
                dadosIniciais={dadosIniciaisModal}
                onFechar={() => setIsModalOpen(false)}
                onSave={handleSalvarModal}
                onDelete={handleApagarModal}
            />
        </div>
    )
}

export default CalendarioPage