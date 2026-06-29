import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"
import { usuariaService } from "../services/userService"
import { formatarDataISO, gerarIntervaloDeDatas } from "../utils/calculosDate"

import Button from "../components/common/Buttons/Button"
import Calendario from "../components/features/Calendario/Calendario"
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao"
import PopupConfirmacao from "../components/common/Modals/PopupConfirmacao"
import "./Calendario.css"

const CalendarioPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalModo, setModalModo] = useState("registrar")
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({})
    
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [duracaoUsuaria, setDuracaoUsuaria] = useState(5)

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setIsLoading(true)
                const mesFormatado = String(mesFiltro).padStart(2, '0');
                const dadosBrutos = await cicloService.obterCalendario(mesFormatado, anoFiltro)
                setDadosCalendario(dadosBrutos)

                const perfil = await usuariaService.obterPerfil()
                if (perfil.duracaoMenstruacao) {
                    setDuracaoUsuaria(perfil.duracaoMenstruacao)
                }

            } catch (error) {
                console.error("Erro ao sincronizar com o cosmos:", error)
            } finally {
                setIsLoading(false)
            }
        }
        
        carregarDados()
    }, [mesFiltro, anoFiltro])

    useEffect(() => {
        if (isModalOpen || isPopupOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
        }
    }, [isModalOpen, isPopupOpen])

    // Extração segura do array de dias do backend
    const extrairDias = (dados) => {
        if (!dados) return [];
        if (Array.isArray(dados)) return dados;
        if (Array.isArray(dados.dias)) return dados.dias;
        if (dados.calendario && Array.isArray(dados.calendario.dias)) return dados.calendario.dias;
        return [];
    };

    const listaDias = extrairDias(dadosCalendario);

    const diasMenstruacaoFormatados = listaDias
        .filter(d => d.registrada === true || d.menstruacao === true || d.isMenstruacao === true)
        .map(d => d.data.split('T')[0])

    const diasPrevistosFormatados = listaDias
        .filter(d => d.prevista === true || d.isPrevita === true || d.fase === 'prevista')
        .map(d => d.data.split('T')[0])

    // ADAPTER: Converte YYYY-MM-DD de volta para DD/MM/YYYY apenas para o utilitário gerarIntervaloDeDatas
    const paraUtils = (strISO) => {
        if (!strISO) return "";
        if (strISO.includes('/')) return strISO; // Se já tiver barras, mantém
        const [ano, mes, dia] = strISO.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const handleDayClick = (dataStrISO) => {
        const isRegistrada = diasMenstruacaoFormatados.includes(dataStrISO)
        
        // Movemos o formatador para fora do 'if' para podermos usá-lo tanto para editar quanto para criar
        const formatarParaModal = (dateObj) => {
            const dia = String(dateObj.getDate()).padStart(2, '0')
            const mes = String(dateObj.getMonth() + 1).padStart(2, '0')
            return `${dateObj.getFullYear()}-${mes}-${dia}` // Formato ISO para o Input nativo
        }

        if (isRegistrada) {
            let dataInicioObj = new Date(dataStrISO + 'T12:00:00')
            while (true) {
                const anterior = new Date(dataInicioObj)
                anterior.setDate(anterior.getDate() - 1)
                if (diasMenstruacaoFormatados.includes(formatarDataISO(anterior))) {
                    dataInicioObj = anterior
                } else break
            }

            let dataFimObj = new Date(dataStrISO + 'T12:00:00')
            while (true) {
                const proximo = new Date(dataFimObj)
                proximo.setDate(proximo.getDate() + 1)
                if (diasMenstruacaoFormatados.includes(formatarDataISO(proximo))) {
                    dataFimObj = proximo
                } else break
            }

            setModalModo("editar")
            setDadosIniciaisModal({
                dataInicio: formatarParaModal(dataInicioObj),
                dataFim: formatarParaModal(dataFimObj)
            })
        } else {
            // A MÁGICA ACONTECE AQUI: Quando é um novo registro
            setModalModo("registrar")
            
            // 1. Pegamos o dia que a usuária clicou
            const dataFimCalculada = new Date(dataStrISO + 'T12:00:00')
            
            // 2. Somamos a duração da menstruação dela (menos 1, porque o próprio dia clicado já conta como o dia 1)
            // O fallback de `|| 5` garante que não quebre caso o perfil não tenha carregado a tempo
            dataFimCalculada.setDate(dataFimCalculada.getDate() + ((duracaoUsuaria || 5) - 1))

            // 3. Entregamos o início e o fim preenchidos perfeitamente para o Modal!
            setDadosIniciaisModal({ 
                dataInicio: dataStrISO, 
                dataFim: formatarParaModal(dataFimCalculada) 
            })
        }
        setIsModalOpen(true)
    }

    const handleSalvarModal = async (dadosDoModal) => {
        try {
            // Convertendo os inputs para o formato com barras que o calculosDate espera
            const inicioAntigo = paraUtils(dadosIniciaisModal.dataInicio);
            const fimAntigo = paraUtils(dadosIniciaisModal.dataFim || dadosIniciaisModal.dataInicio);
            const inicioNovo = paraUtils(dadosDoModal.dataInicio);
            const fimNovo = paraUtils(dadosDoModal.dataFim || dadosDoModal.dataInicio);

            const diasAntigos = modalModo === "editar" 
                ? gerarIntervaloDeDatas(inicioAntigo, fimAntigo, duracaoUsuaria)
                : []

            const diasNovos = gerarIntervaloDeDatas(inicioNovo, fimNovo, duracaoUsuaria)

            const diasParaDesmarcar = diasAntigos.filter(dia => !diasNovos.includes(dia))
            const diasParaMarcar = diasNovos.filter(dia => !diasAntigos.includes(dia) && !diasMenstruacaoFormatados.includes(dia))

            let ultimoCalendario = dadosCalendario

            for (const diaISO of diasParaDesmarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            for (const diaISO of diasParaMarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            setDadosCalendario(ultimoCalendario)
            setIsModalOpen(false)
            
        } catch (error) {
            console.error("Erro ao salvar/editar período:", error)
        }
    }

    const abrirPopupApagar = () => {
        setIsPopupOpen(true)
    }

    const confirmarApagarPerido = async () => {
        try {
            const inicioAntigo = paraUtils(dadosIniciaisModal.dataInicio);
            const fimAntigo = paraUtils(dadosIniciaisModal.dataFim || dadosIniciaisModal.dataInicio);

            const diasAntigos = gerarIntervaloDeDatas(inicioAntigo, fimAntigo, duracaoUsuaria)
            let ultimoCalendario = dadosCalendario

            for (const diaISO of diasAntigos) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            setDadosCalendario(ultimoCalendario)
            setIsPopupOpen(false)
            setIsModalOpen(false)
            
        } catch (error) {
            console.error("Erro ao apagar período:", error)
        }
    }

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend
    }

    const dicionarioFasesLunares = listaDias.reduce((acc, d) => {
        if (!d.data) return acc;
        const dataLimpa = d.data.split('T')[0]
        acc[dataLimpa] = normalizarFaseParaComponente(d.faseLunar?.nome || d.faseLunar)
        return acc
    }, {})

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
                            setMesFiltro(1)
                            setAnoFiltro(ano => ano + 1)
                        } else {
                            setMesFiltro(m => m + 1)
                        }
                    }}
                    onPrevMonth={() => {
                        if (mesFiltro === 1) {
                            setMesFiltro(12)
                            setAnoFiltro(ano => ano - 1)
                        } else {
                            setMesFiltro(m => m - 1)
                        }
                    }}
                />

                <div className="cal-page-action-area">
                    <Button 
                        variant="redondo"
                        maxWidth="280px"
                        onClick={() => {
                            setModalModo("registrar")
                            setDadosIniciaisModal({ dataInicio: "", dataFim: "" })
                            setIsModalOpen(true)
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
                message="Tem certeza que deseja apagar este registro? Esta ação não pode ser desfeita."
                variante="perigo"
                backgroundColor="radial-gradient(111.8% 111.8% at 50% 0%, rgba(150, 22, 32, 0.08) 0%, rgba(0, 0, 0, 0.00) 58%)"
                textColor="#F5F0E9"
                onCancel={() => setIsPopupOpen(false)}
                botaoCancelar={
                    <Button 
                        variant="padrao" 
                        backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)" 
                        textColor="#E0C58F" 
                        color="rgba(224, 197, 143, 0.50)"
                        onClick={() => setIsPopupOpen(false)}
                        width="8rem"
                    >
                        Cancelar
                    </Button>
                }
                botaoConfirmar={
                    <Button 
                        variant="padrao"
                        backgroundColor="rgba(88, 8, 16, 0.22)"
                        color="rgba(245, 240, 233, 0.50)"
                        textColor="#F5F0E9"
                        onClick={confirmarApagarPerido}
                        width="8rem"
                    >
                        Apagar REGISTRO
                    </Button>
                }
            />
        </div>
    )
}

export default CalendarioPage