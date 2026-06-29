import { useState, useEffect } from "react";
import { cicloService } from "../services/cicloService";

import Button from "../components/common/Buttons/Button";
import Calendario from "../components/features/Calendario/Calendario";
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao";
import PopupConfirmacao from "../components/common/Modals/PopupConfirmacao";
import "./Calendario.css";

// ==========================================
// FUNÇÕES AUXILIARES MATEMÁTICAS (DATAS)
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

const gerarIntervaloDeDatas = (dataInicioBr, dataFimBr, duracaoPadrao) => {
    if (!dataInicioBr) return [];
    
    const inicio = parseDataBr(dataInicioBr);
    let fim;
    
    if (dataFimBr) {
        fim = parseDataBr(dataFimBr);
    } else {
        // Regra EXATA: Preenche com base no número exato configurado pela usuária
        fim = new Date(inicio);
        fim.setDate(fim.getDate() + (duracaoPadrao - 1));
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
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalModo, setModalModo] = useState("registrar");
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({});
    
    // Estado do Popup de Confirmação
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Estado para guardar a configuração REAL da usuária vinda do backend
    const [duracaoUsuaria, setDuracaoUsuaria] = useState(5); // 5 é só um fallback

    const hoje = new Date();
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1);
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear());
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] });

    // ==========================================
    // CARREGAMENTO DO CALENDÁRIO E DO PERFIL
    // ==========================================
    useEffect(() => {
        const carregarDados = async () => {
            try {
                setIsLoading(true);
                
                // 1. Busca os dados do calendário do mês
                const dadosBrutos = await cicloService.obterCalendario(mesFiltro, anoFiltro);
                setDadosCalendario(dadosBrutos);

                // 2. Busca o Perfil da usuária para pegar a duracaoMenstruacao exata
                // ATENÇÃO: Ajuste a URL '/api/usuarias/perfil' se a sua rota de perfil for diferente!
                const token = localStorage.getItem('token');
                const respostaPerfil = await fetch('http://localhost:3000/api/usuarias/perfil', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (respostaPerfil.ok) {
                    const perfil = await respostaPerfil.json();
                    if (perfil.duracaoMenstruacao) {
                        setDuracaoUsuaria(perfil.duracaoMenstruacao);
                    }
                }

            } catch (error) {
                console.error("Erro ao sincronizar com o cosmos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, [mesFiltro, anoFiltro]);

    // Trava o scroll da página
    useEffect(() => {
        if (isModalOpen || isPopupOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }
    }, [isModalOpen, isPopupOpen]);

    const diasMenstruacaoFormatados = dadosCalendario.dias
        .filter(d => d.registrada)
        .map(d => d.data.split('T')[0]);

    const diasPrevistosFormatados = dadosCalendario.dias
        .filter(d => d.prevista)
        .map(d => d.data.split('T')[0]);

    // ==========================================
    // CLIQUE NO DIA: CAPTURA O PERÍODO COMPLETO
    // ==========================================
    const handleDayClick = (dataStrISO) => {
        const isRegistrada = diasMenstruacaoFormatados.includes(dataStrISO);
        
        if (isRegistrada) {
            let dataInicioObj = new Date(dataStrISO + 'T12:00:00');
            while (true) {
                const anterior = new Date(dataInicioObj);
                anterior.setDate(anterior.getDate() - 1);
                if (diasMenstruacaoFormatados.includes(formatarDataISO(anterior))) {
                    dataInicioObj = anterior;
                } else break;
            }

            let dataFimObj = new Date(dataStrISO + 'T12:00:00');
            while (true) {
                const proximo = new Date(dataFimObj);
                proximo.setDate(proximo.getDate() + 1);
                if (diasMenstruacaoFormatados.includes(formatarDataISO(proximo))) {
                    dataFimObj = proximo;
                } else break;
            }

            const formatarParaModal = (dateObj) => {
                const dia = String(dateObj.getDate()).padStart(2, '0');
                const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
                return `${dia}/${mes}/${dateObj.getFullYear()}`;
            };

            setModalModo("editar");
            setDadosIniciaisModal({
                dataInicio: formatarParaModal(dataInicioObj),
                dataFim: formatarParaModal(dataFimObj)
            });
        } else {
            const [ano, mes, dia] = dataStrISO.split('-');
            setModalModo("registrar");
            setDadosIniciaisModal({ dataInicio: `${dia}/${mes}/${ano}`, dataFim: "" });
        }
        setIsModalOpen(true);
    };

    // ==========================================
    // LÓGICA DE SALVAR E EDITAR (COM DIFF)
    // ==========================================
    const handleSalvarModal = async (dadosDoModal) => {
        try {
            const diasAntigos = modalModo === "editar" 
                ? gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim, duracaoUsuaria)
                : [];

            const diasNovos = gerarIntervaloDeDatas(dadosDoModal.dataInicio, dadosDoModal.dataFim, duracaoUsuaria);

            const diasParaDesmarcar = diasAntigos.filter(dia => !diasNovos.includes(dia));
            const diasParaMarcar = diasNovos.filter(dia => !diasAntigos.includes(dia) && !diasMenstruacaoFormatados.includes(dia));

            let ultimoCalendario = dadosCalendario;

            for (const diaISO of diasParaDesmarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro);
                ultimoCalendario = resposta.calendario;
            }

            for (const diaISO of diasParaMarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro);
                ultimoCalendario = resposta.calendario;
            }

            setDadosCalendario(ultimoCalendario);
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("Erro ao salvar/editar período:", error);
        }
    };

    // ==========================================
    // LÓGICA DE APAGAR (CHAMA O POPUP)
    // ==========================================
    const abrirPopupApagar = () => {
        setIsPopupOpen(true);
    };

    const confirmarApagarPerido = async () => {
        try {
            const diasAntigos = gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim, duracaoUsuaria);
            let ultimoCalendario = dadosCalendario;

            for (const diaISO of diasAntigos) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro);
                ultimoCalendario = resposta.calendario;
            }

            setDadosCalendario(ultimoCalendario);
            setIsPopupOpen(false);
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("Erro ao apagar período:", error);
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
                            setMesFiltro(1); setAnoFiltro(ano => ano + 1);
                        } else setMesFiltro(m => m + 1);
                    }}
                    onPrevMonth={() => {
                        if (mesFiltro === 1) {
                            setMesFiltro(12); setAnoFiltro(ano => ano - 1);
                        } else setMesFiltro(m => m - 1);
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
                onDelete={abrirPopupApagar}
            />

            <PopupConfirmacao 
                isOpen={isPopupOpen}
                title="Apagar Ciclo"
                message="Você tem certeza que deseja excluir os registros deste ciclo? Esta ação não poderá ser desfeita."
                variante="perigo"
                backgroundColor="#181119"
                borderColor="#D74B55"
                textColor="#F5F0E9"
                onCancel={() => setIsPopupOpen(false)}
                botaoCancelar={
                    <Button 
                        variant="padrao" 
                        backgroundColor="rgba(224, 197, 143, 0.05)" 
                        textColor="#E0C58F" 
                        onClick={() => setIsPopupOpen(false)}
                        width="8rem"
                    >
                        Cancelar
                    </Button>
                }
                botaoConfirmar={
                    <Button 
                        variant="padrao" 
                        backgroundColor="rgba(215, 75, 85, 0.2)" 
                        textColor="#D74B55" 
                        onClick={confirmarApagarPerido}
                        width="8rem"
                    >
                        Apagar
                    </Button>
                }
            />
        </div>
    );
};

export default CalendarioPage;