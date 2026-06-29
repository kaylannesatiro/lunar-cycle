import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"

import Button from "../components/common/Buttons/Button"
import Calendario from "../components/features/Calendario/Calendario"
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao"
import "./Calendario.css"

// ==========================================
// FUNÇÕES AUXILIARES DE DATA
// ==========================================
const parseDataBr = (dataStr) => {
    if (!dataStr) return new Date();
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(ano, mes - 1, dia);
};

const formatarDataISO = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

// Modificado para receber a duração configurada dinamicamente
const gerarIntervaloDeDatas = (dataInicioBr, dataFimBr, duracaoConfigurada) => {
    const inicio = parseDataBr(dataInicioBr);
    let fim;
    
    if (dataFimBr) {
        fim = parseDataBr(dataFimBr);
    } else {
        // Usa a duração vinda das configurações da usuária no banco de dados
        fim = new Date(inicio);
        fim.setDate(fim.getDate() + (parseInt(duracaoConfigurada, 10) - 1));
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
    
    const [modalModo, setModalModo] = useState("registrar")
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({})

    // NOVO ESTADO: Guarda as configurações da usuária (duração do ciclo, menstruação, etc.)
    const [dadosConfigUsuaria, setDadosConfigUsuaria] = useState(null)

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    // 1. Carrega os registros do calendário E as configurações da usuária logada
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                setIsLoading(true)
                
                // Busca em paralelo: os dias do mês E o perfil/configurações da usuária
                const [dadosBrutosCalendario, dadosHomePerfil] = await Promise.all([
                    cicloService.obterCalendario(mesFiltro, anoFiltro),
                    cicloService.obterDadosHome() // Traz as configurações cadastradas pela usuária
                ]);

                setDadosCalendario(dadosBrutosCalendario);
                setDadosConfigUsuaria(dadosHomePerfil); // Salva as configurações (como duracaoMenstruacao)
            } catch (error) {
                console.error("Erro ao sincronizar dados com a órbita lunar:", error)
            } finally {
                setIsLoading(false)
            }
        }
        carregarDadosIniciais()
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

    const handleDayClick = (dataStrISO) => {
        const isRegistrada = diasMenstruacaoFormatados.includes(dataStrISO);
        
        let dataInicioObj = new Date(dataStrISO + 'T12:00:00');
        
        if (isRegistrada) {
            while (true) {
                const anterior = new Date(dataInicioObj);
                anterior.setDate(anterior.getDate() - 1);
                const anteriorISO = formatarDataISO(anterior);
                if (diasMenstruacaoFormatados.includes(anteriorISO)) {
                    dataInicioObj = anterior;
                } else {
                    break;
                }
            }

            let dataFimObj = new Date(dataStrISO + 'T12:00:00');
            while (true) {
                const proximo = new Date(dataFimObj);
                proximo.setDate(proximo.getDate() + 1);
                const proximoISO = formatarDataISO(proximo);
                if (diasMenstruacaoFormatados.includes(proximoISO)) {
                    dataFimObj = proximo;
                } else {
                    break;
                }
            }

            const formatarParaModal = (dateObj) => {
                const dia = String(dateObj.getDate()).padStart(2, '0');
                const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
                const ano = dateObj.getFullYear();
                return `${dia}/${mes}/${ano}`;
            };

            const temMultiplosDias = dataInicioObj.getTime() !== dataFimObj.getTime();

            setModalModo("editar");
            setDadosIniciaisModal({
                dataInicio: formatarParaModal(dataInicioObj),
                dataFim: temMultiplosDias ? formatarParaModal(dataFimObj) : ""
            });

        } else {
            const [ano, mes, dia] = dataStrISO.split('-');
            const dataFormatadaModal = `${dia}/${mes}/${ano}`;
            
            setModalModo("registrar");
            setDadosIniciaisModal({ dataInicio: dataFormatadaModal, dataFim: "" });
        }

        setIsModalOpen(true);
    };

    // ==========================================
    // SALVAMENTO USANDO A CONFIGURAÇÃO DO BANCO
    // ==========================================
    const handleSalvarModal = async (dadosDoModal) => {
        try {
            // Pega o valor real vindo do backend. Se a API falhar ou não achar por algum motivo místico, 
            // usamos 4 como um plano de segurança ("fallback") baseado na média padrão.
            const duracaoMenstruacaoConfigurada = dadosConfigUsuaria?.duracaoMenstruacao || 4;

            // Envia a duração salva nas configurações da usuária para calcular o preenchimento automático
            const diasAlvo = gerarIntervaloDeDatas(
                dadosDoModal.dataInicio, 
                dadosDoModal.dataFim, 
                duracaoMenstruacaoConfigurada
            );
            
            const diasParaMarcar = diasAlvo.filter(diaISO => !diasMenstruacaoFormatados.includes(diaISO));
            
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
            console.error("Erro ao salvar período menstrual em lote:", error);
        }
    };

    const handleApagarModal = async () => {
        try {
            const diasAlvo = gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim, dadosConfigUsuaria?.duracaoMenstruacao || 4);
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

export default CalendarioPage;