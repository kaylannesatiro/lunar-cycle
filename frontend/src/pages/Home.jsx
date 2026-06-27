import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"

import Button from "../components/common/Buttons/Button"
import CardOraculo from "../components/features/Ciclo/CardOraculo"
import DadosExtras from "../components/features/Ciclo/DadosExtras"
import Calendario from "../components/features/Calendario/Calendario"
import "./Home.css"

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [dadosHome, setDadosHome] = useState({
        nomeUsuaria: '',
        faseLunar: { nome: 'Nova', icone: '🌑' },
        menstruandoHoje: false,
        possuiCicloMenstrual: false,
        diaDoCiclo: 1,
        previsaoProximoCiclo: '--/--/----'
    })

    const hoje = new Date();
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    const diaDestaque = String(hoje.getDate()).padStart(2, '0')
    const mesSubtitulo = hoje.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
    const anoFrase = hoje.getFullYear()

    useEffect(() => {
        const iniciarDashboard = async () => {
            try {
                setIsLoading(true)
                const dadosHomeBrutos = await cicloService.obterDadosHome()
                const dadosCalendarioBrutos = await cicloService.obterCalendario(mesFiltro, anoFiltro)
                
                setDadosHome(dadosHomeBrutos)
                setDadosCalendario(dadosCalendarioBrutos)
            } catch (error) {
                console.error("Falha ao alinhar órbitas com o servidor:", error)
            } finally {
                setIsLoading(false)
            }
        }

        iniciarDashboard()
    }, [])

    useEffect(() => {
        const atualizarMesCalendario = async () => {
            try {
                const dadosMes = await cicloService.obterCalendario(mesFiltro, anoFiltro)
                setDadosCalendario(dadosMes)
            } catch (error) {
                console.error("Erro ao transicionar mês lunar:", error)
            }
        };

        if (!isLoading) atualizarMesCalendario()
    }, [mesFiltro, anoFiltro])

    const handleToggleMenstruacaoHoje = async () => {
        try {
            const resposta = await cicloService.alternarMenstruacaoHoje()
            setDadosHome(resposta.dadosHome)
            
            const dadosCalendarioAtualizados = await cicloService.obterCalendario(mesFiltro, anoFiltro)
            setDadosCalendario(dadosCalendarioAtualizados)
        } catch (error) {
            console.error("Erro ao registrar pulsação de hoje:", error)
        }
    }

    const handleToggleDiaCalendario = async (dataStr) => {
        try {
            const resposta = await cicloService.alternarMenstruacaoDia(dataStr, mesFiltro, anoFiltro)
            setDadosCalendario(resposta.calendario)
            
            const dadosHomeAtualizados = await cicloService.obterDadosHome()
            setDadosHome(dadosHomeAtualizados)
        } catch (error) {
            console.error("Erro ao alterar registro do dia:", error)
        }
    }

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend
    }

    const diasMenstruacaoFormatados = dadosCalendario.dias
        .filter(d => d.registrada)
        .map(d => d.data);

    const diasPrevistosFormatados = dadosCalendario.dias
        .filter(d => d.prevista)
        .map(d => d.data);

    const dicionarioFasesLunares = dadosCalendario.dias.reduce((acc, d) => {
        acc[d.data] = normalizarFaseParaComponente(d.faseLunar?.nome)
        return acc
    }, {})

    if (isLoading) return <div className="home-loading">Alinhando eixos astrológicos...</div>

    return (
        <div className="home-dashboard-shell">
            <header className="home-cronos-header">
                <span className="home-titulo-menor">✦ CICLO ATUAL ✦</span>
                <h1 className="home-dia-destaque">{diaDestaque}</h1>
                <h2 className="home-mes-subtitulo">{mesSubtitulo}</h2>
                <p className="home-frase-ano">{anoFrase}</p>
            </header>

            <div className="home-action-container">
                <Button 
                    backgroundColor={dadosHome.menstruandoHoje ? "rgba(190, 38, 50, 0.2)": ''}
                    color={dadosHome.menstruandoHoje ? "#BE2632": ''}
                    textColor={dadosHome.menstruandoHoje ? "#FF8F97" : ""}
                    variant="redondo"
                    maxWidth="280px"
                    onClick={handleToggleMenstruacaoHoje}
                >
                    {dadosHome.menstruandoHoje ? "◈ MENSTRUAÇÃO REGISTRADA" : "◈ Registrar Menstruação"}
                </Button>
            </div>

            <div className="home-orbita-separador">
                <div className="home-planeta-focal" />
            </div>

            <section className="home-secao-oraculo">
                <span className="home-titulo-menor">✦ ORÁCULO LUNAR ✦</span>
                <h3 className="home-titulo-sessao">MENSAGEM DO COSMOS</h3>
                
                <CardOraculo estaMenstruada={dadosHome.estaMenstruada}/>
                <DadosExtras/>
            </section>

            <section className="home-secao-calendario">
                <span className="home-titulo-menor">✦ CALENDÁRIO LUNAR ✦</span>
                <div className="home-calendario-wrapper">
                    <Calendario 
                        diasMenstruacao={diasMenstruacaoFormatados}
                        diasPrevistos={diasPrevistosFormatados}
                        fasesLunares={dicionarioFasesLunares}
                        onDayClick={handleToggleDiaCalendario}
                        onNextMonth={() => setMesFiltro(prev => prev === 12 ? 1 : prev + 1)}
                        onPrevMonth={() => setMesFiltro(prev => prev === 1 ? 12 : prev - 1)}
                    />
                </div>
            </section>
        </div>
    )
}

export default Home