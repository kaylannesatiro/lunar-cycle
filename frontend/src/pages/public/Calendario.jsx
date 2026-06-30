import { useState, useEffect } from "react"
import { cicloService } from "../../api/services/cicloService"

import Calendario from "../../components/features/Calendario/Calendario"
import "../private/Calendario.css"

const CalendarioPage = () => {
    const [isLoading, setIsLoading] = useState(true)

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true)

            try {
                const mesFormatado = String(mesFiltro).padStart(2, '0')
                const dadosBrutos = await cicloService.obterCalendario(mesFormatado, anoFiltro)
                setDadosCalendario(dadosBrutos)
            } catch (error) {
                console.error("Erro ao carregar calendário:", error)
            }

            setIsLoading(false)
        }

        carregarDados()
    }, [mesFiltro, anoFiltro])

    const listaDias = dadosCalendario?.dias || []

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend
    }

    const dicionarioFasesLunares = listaDias.reduce((acc, d) => {
        if (!d.data) return acc
        acc[d.data] = normalizarFaseParaComponente(d.faseLunar?.nome || d.faseLunar)
        return acc
    }, {})

    if (isLoading) return <div className="cal-page-loading">Sintonizando marés e ciclos lunares...</div>

    return (
        <div className="cal-page-shell">
            <main className="cal-page-main-content">
                <Calendario
                    mesAtual={mesFiltro - 1}
                    anoAtual={anoFiltro}
                    fasesLunares={dicionarioFasesLunares}
                    mostrarLegenda={false}
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
            </main>
        </div>
    )
}

export default CalendarioPage