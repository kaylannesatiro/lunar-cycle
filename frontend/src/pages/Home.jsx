import { useState, useEffect } from "react"
import { cicloService } from "../services/cicloService"

import Button from "../components/common/Buttons/Button"
import CardOraculo from "../components/features/Ciclo/CardOraculo"
import DadosExtras from "../components/features/Ciclo/DadosExtras"
import Calendario from "../components/features/Calendario/Calendario"
import ModalMenstruacao from "../components/features/Modals/ModalMenstruacao"
import AnimacaoLua from "../components/common/Animation/AnimacaoLua"
import "./Home.css"

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false);

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

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
            
            document.body.classList.add('travar-scroll')
        } else {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
            document.body.classList.remove('travar-scroll')
        }

        return () => {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
            document.body.classList.remove('travar-scroll')
        }
    }, [isModalOpen])

    const handleSalvarModal = async (dadosDoModal) => {
        try {
            console.log("Dados recebidos do modal:", dadosDoModal);
            const dadosCalendarioAtualizados = await cicloService.obterCalendario(mesFiltro, anoFiltro)
            setDadosCalendario(dadosCalendarioAtualizados)
            setIsModalOpen(false)
            
        } catch (error) {
            console.error("Erro ao salvar período pelo modal:", error)
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
        .map(d => d.data.split('T')[0])

    const diasPrevistosFormatados = dadosCalendario.dias
        .filter(d => d.prevista)
        .map(d => d.data.split('T')[0])

    const dicionarioFasesLunares = dadosCalendario.dias.reduce((acc, d) => {
        const dataLimpa = d.data.split('T')[0]
        acc[dataLimpa] = normalizarFaseParaComponente(d.faseLunar?.nome)
        return acc
    }, {})

    if (isLoading) return <div className="home-loading">Alinhando eixos astrológicos...</div>


    return (
        <div className="home-dashboard-shell">
            <header className="home-header-container">
                <span className="home-titulo-menor-topo">✦ CICLO ATUAL ✦</span>
                <h1 className="home-dia-destaque">{diaDestaque}</h1>
                <h2 className="home-mes-subtitulo">{mesSubtitulo}</h2>
                <p className="home-frase-ano">{anoFrase}</p>
                
                <div className="home-container-divisao">
                    <div className="home-linha-divisao" />
                </div>

                <div className="home-action-container">
                    <Button 
                        backgroundColor={dadosHome.menstruandoHoje ? "rgba(120, 12, 22, 0.22)": ''}
                        color={dadosHome.menstruandoHoje ? "rgba(245, 240, 233, 0.50)": ''}
                        textColor={dadosHome.menstruandoHoje ? "#F5F0E9" : ''}
                        variant="redondo"
                        maxWidth="280px"
                        onClick={dadosHome.menstruandoHoje ? undefined : () => setIsModalOpen(true)}
                        style={dadosHome.menstruandoHoje ? { pointerEvents: 'none', cursor: 'default' } : {}}
                        disabled={dadosHome.menstruandoHoje}
                    >
                        {dadosHome.menstruandoHoje ? " ✦ SUA MENSTRUAÇÃO ESTÁ REGISTRADA" : "◈ Registrar Menstruação"}
                    </Button>
                </div>
            </header>

            <AnimacaoLua />

            <section className="home-secao-oraculo">
                <div className="home-container-titulo-menor">
                    <span className="home-titulo-menor-sessao">✦ ORÁCULO LUNAR ✦</span>
                </div>
                
                <div className="home-container-titulo-sessao">
                    <h3 className="home-titulo-sessao">MENSAGEM DO COSMOS</h3>
                </div>
                
                <div className="home-oraculo-component-wrapper">
                    <CardOraculo 
                        estaMenstruada={dadosHome.estaMenstruada}
                        faseLunar={normalizarFaseParaComponente(dadosHome.faseLunar?.nome)}
                    />
                </div>

                <div className="home-dadosextras-component-wrapper">
                    <DadosExtras/>
                </div>
            </section>

            <section className="home-secao-calendario">
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
                            setAnoFiltro(ano => ano + 1);
                        } else {
                            setMesFiltro(m => m + 1);
                        }
                    }}
                    onPrevMonth={() => {
                        if (mesFiltro === 1) {
                            setMesFiltro(12);
                            setAnoFiltro(ano => ano - 1);
                        } else {
                            setMesFiltro(m => m - 1);
                        }
                    }}
                />
            </section>

            <ModalMenstruacao 
                isOpen={isModalOpen}
                modo="registrar"
                onFechar={() => setIsModalOpen(false)}
                onSave={handleSalvarModal}
            />
        </div>
    )
}

export default Home