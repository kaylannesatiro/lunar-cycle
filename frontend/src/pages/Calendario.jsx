import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"

import Button from "../components/common/Buttons/Button"
import Calendario from "../components/features/Calendario/Calendario"
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao"
import "./Calendario.css"

const CalendarioPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const handleSalvarModal = async (dadosDoModal) => {
        try {
            console.log("Período registrado via visão mensal:", dadosDoModal)
            const dadosAtualizados = await cicloService.obterCalendario(mesFiltro, anoFiltro)
            setDadosCalendario(dadosAtualizados)
            setIsModalOpen(false)
        } catch (error) {
            console.error("Erro ao salvar período menstrual:", error)
        }
    }

    const handleToggleDiaCalendario = async (dataStr) => {
        try {
            const resposta = await cicloService.alternarMenstruacaoDia(dataStr, mesFiltro, anoFiltro)
            setDadosCalendario(resposta.calendario)
        } catch (error) {
            console.error("Erro ao alternar registro do dia selecionado:", error)
        }
    };

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend;
    };

    const diasMenstruacaoFormatados = dadosCalendario.dias
        .filter(d => d.registrada)
        .map(d => d.data.split('T')[0])

    const diasPrevistosFormatados = dadosCalendario.dias
        .filter(d => d.prevista)
        .map(d => d.data.split('T')[0])

    const dicionarioFasesLunares = dadosCalendario.dias.reduce((acc, d) => {
        const dataLimpa = d.data.split('T')[0];
        acc[dataLimpa] = normalizarFaseParaComponente(d.faseLunar?.nome)
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
                    onDayClick={handleToggleDiaCalendario}
                    onNextMonth={() => {
                        if (mesFiltro === 12) {
                            setMesFiltro(1);
                            setAnoFiltro(ano => ano + 1)
                        } else {
                            setMesFiltro(m => m + 1)
                        }
                    }}
                    onPrevMonth={() => {
                        if (mesFiltro === 1) {
                            setMesFiltro(12);
                            setAnoFiltro(ano => ano - 1)
                        } else {
                            setMesFiltro(m => m - 1)
                        }
                    }}
                />

                <div className="cal-page-action-area">
                    <Button 
                        variant="padrao"
                        backgroundColor="transparent"
                        color="rgba(224, 197, 143, 0.40)"
                        textColor="#E0C58F"
                        style={{ border: "1px solid #E0C58F" }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        ◈ Registrar Menstruação
                    </Button>
                </div>
            </main>

            <ModalMenstruacao 
                isOpen={isModalOpen}
                modo="registrar"
                onFechar={() => setIsModalOpen(false)}
                onSave={handleSalvarModal}
            />
        </div>
    )
}

export default CalendarioPage