import { useState, useEffect } from "react"
import { cicloService } from "../../api/services/cicloService"
import { usuariaService } from "../../api/services/userService"
import { gerarIntervaloDeDatas } from "../../utils/calculosDate"

import Button from "../../components/common/Buttons/Button"
import CardOraculo from "../../components/features/Ciclo/CardOraculo"
import DadosExtras from "../../components/features/Ciclo/DadosExtras"
import Calendario from "../../components/features/Calendario/Calendario"
import ModalMenstruacao from "../../components/features/Modals/ModalMenstruacao"
import AnimacaoLua from "../../components/common/Animation/AnimacaoLua"
import "./Home.css"

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({})
    const [duracaoUsuaria, setDuracaoUsuaria] = useState(5)

    const [dadosHome, setDadosHome] = useState({
        nomeUsuaria: '',
        faseLunar: { nome: 'Nova', icone: '🌑' },
        menstruandoHoje: false,
        possuiCicloMenstrual: false,
        diaDoCiclo: 1,
        previsaoProximoCiclo: '--/--/----'
    })

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    const diaDestaque = String(hoje.getDate()).padStart(2, '0')
    const mesSubtitulo = hoje.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
    const anoFrase = hoje.getFullYear()

    useEffect(() => {
        const iniciarDashboard = async () => {
            setIsLoading(true)

            try {
                const dadosHomeBrutos = await cicloService.obterDadosHome()
                setDadosHome(dadosHomeBrutos)
            } catch (error) {
                console.error("Falha ao carregar dados da home:", error)
            }

            try {
                const mesFormatado = String(mesFiltro).padStart(2, '0')
                const dadosCalendarioBrutos = await cicloService.obterCalendario(mesFormatado, anoFiltro)
                setDadosCalendario(dadosCalendarioBrutos)
            } catch (error) {
                console.error("Falha ao carregar calendário:", error)
            }

            try {
                const perfil = await usuariaService.obterPerfil()
                if (perfil && (perfil.duracaoMenstruacao || perfil.diasMenstruacao)) {
                    setDuracaoUsuaria(Number(perfil.duracaoMenstruacao || perfil.diasMenstruacao))
                }
            } catch (error) {
                console.warn("Perfil não encontrado, usando duração padrão de 5 dias:", error)
            }

            setIsLoading(false)
        }

        iniciarDashboard()
    }, [])

    useEffect(() => {
        const atualizarMesCalendario = async () => {
            try {
                const mesFormatado = String(mesFiltro).padStart(2, '0')
                const dadosMes = await cicloService.obterCalendario(mesFormatado, anoFiltro)
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

    const abrirModal = () => {
        const duracaoEfetiva = duracaoUsuaria || 5

        const ano = hoje.getFullYear()
        const mes = String(hoje.getMonth() + 1).padStart(2, '0')
        const dia = String(hoje.getDate()).padStart(2, '0')
        const dataInicioBR = `${dia}/${mes}/${ano}`

        const dataFimObj = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        dataFimObj.setDate(dataFimObj.getDate() + (duracaoEfetiva - 1))
        const diaF = String(dataFimObj.getDate()).padStart(2, '0')
        const mesF = String(dataFimObj.getMonth() + 1).padStart(2, '0')
        const dataFimBR = `${diaF}/${mesF}/${dataFimObj.getFullYear()}`

        setDadosIniciaisModal({ dataInicio: dataInicioBR, dataFim: dataFimBR })
        setIsModalOpen(true)
    }

    const handleSalvarModal = async (dadosDoModal) => {
        try {
            const duracaoEfetiva = duracaoUsuaria || 5
            const diasNovos = gerarIntervaloDeDatas(dadosDoModal.dataIniciodadosDoModal.dataFim, duracaoEfetiva)

            const listaDiasAtual = dadosCalendario?.dias || []
            const diasJaMarcados = listaDiasAtual
                .filter(d => d.registrada === true)
                .map(d => d.data)

            const diasParaMarcar = diasNovos.filter(dia => !diasJaMarcados.includes(dia))

            let ultimoCalendario = dadosCalendario

            for (const diaISO of diasParaMarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            setDadosCalendario(ultimoCalendario)
            const dadosHomeAtualizados = await cicloService.obterDadosHome()
            setDadosHome(dadosHomeAtualizados)

            setIsModalOpen(false)
        } catch (error) {
            console.error("Erro ao salvar período pelo modal:", error)
        }
    }

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend
    }

    const listaDias = dadosCalendario?.dias || []

    const diasMenstruacaoFormatados = listaDias
        .filter(d => d.registrada === true)
        .map(d => d.data)

    const diasPrevistosFormatados = listaDias
        .filter(d => d.prevista === true)
        .map(d => d.data)

    const dicionarioFasesLunares = listaDias.reduce((acc, d) => {
        if (!d.data) return acc
        acc[d.data] = normalizarFaseParaComponente(d.faseLunar?.nome || d.faseLunar)
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
                        backgroundColor={dadosHome.menstruandoHoje ? "rgba(120, 12, 22, 0.22)" : ''}
                        color={dadosHome.menstruandoHoje ? "rgba(245, 240, 233, 0.50)" : ''}
                        textColor={dadosHome.menstruandoHoje ? "#F5F0E9" : ''}
                        variant="redondo"
                        maxWidth="280px"
                        onClick={dadosHome.menstruandoHoje ? undefined : abrirModal}
                        style={dadosHome.menstruandoHoje ? { pointerEvents: 'none', cursor: 'default' } : {}}
                        disabled={dadosHome.menstruandoHoje}
                    >
                        {dadosHome.menstruandoHoje ? "✦ SUA MENSTRUAÇÃO ESTÁ REGISTRADA" : "◈ Registrar Menstruação"}
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
                        estaMenstruada={dadosHome.menstruandoHoje}
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
            </section>

            <ModalMenstruacao 
                isOpen={isModalOpen}
                modo="registrar"
                dadosIniciais={dadosIniciaisModal}
                onFechar={() => setIsModalOpen(false)}
                onSave={handleSalvarModal}
            />
        </div>
    )
}

export default Home