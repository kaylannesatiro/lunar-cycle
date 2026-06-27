import { useState, useEffect } from "react"

import Button from "../components/common/Buttons/Button"
import CardOraculo from "../components/features/Ciclo/CardOraculo"
import DadosExtras from "../components/features/Ciclo/DadosExtras"
import Calendario from "../components/features/Calendario/Calendario"
import "./Home.css"

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [faseLuaHoje, setFaseLuaHoje] = useState({ nome: '', icone: '', tags: [] })
    
    const [dadosCiclo, setDadosCiclo] = useState({
        diaDoCiclo: '1º',
        proximaLua: 'Carregando...',
        energia: 'Carregando...'
    })

    const hoje = new Date()
    const diaDestaque = String(hoje.getDate()).padStart(2, '0')
    const mesSubtitulo = hoje.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
    const anoFrase = hoje.getFullYear()

    const calcularFaseLuaReal = (date) => {
        const cicloLunar = 29.530588853;
        const baseLuaNova = new Date(2000, 0, 6);
        const diffMs = date - baseLuaNova;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const diasFase = diffDays % cicloLunar;

        if (diasFase < 1.84) return { nome: 'LUA NOVA', tags: ['INTUIÇÃO', 'RECOMEÇO', 'PLANEJAMENTO'] };
        if (diasFase < 5.53) return { nome: 'LUA CRESCENTE CONVEXA', tags: ['AÇÃO', 'FORÇA', 'CRESCIMENTO'] };
        if (diasFase < 9.22) return { nome: 'QUARTO CRESCENTE', tags: ['MOVIMENTO', 'EXECUÇÃO', 'PROGRESSE'] };
        if (diasFase < 12.91) return { nome: 'LUA GIBOSA CRESCENTE', tags: ['REFINAMENTO', 'ANÁLISE', 'PRODUÇÃO'] };
        if (diasFase < 16.60) return { nome: 'LUA CHEIA', tags: ['GRATIDÃO', 'COLHEITA', 'REFLEXÃO'] };
        if (diasFase < 20.29) return { nome: 'LUA DISSEMINADORA', tags: ['PARTILHA', 'ENSINAMENTO', 'GRATIDÃO'] };
        if (diasFase < 23.98) return { nome: 'QUARTO MINGUANTE', tags: ['BANIMENTO', 'LIMPEZA', 'REAVALIAÇÃO'] };
        return { nome: 'LUA MINGUANTE BALSÂMICA', tags: ['DESCANSO', 'DESAPEGO', 'ENCERRAMENTO'] };
    }

    useEffect(() => {
        const carregarDashboardCosmico = async () => {
            try {
                setIsLoading(true)
                
                if (cicloService && typeof cicloService.obterDadosCiclo === 'function') {
                    const dadosDoBanco = await cicloService.obterDadosCiclo()
                    setDadosCiclo(dadosDoBanco)
                }

                const resultadoLua = calcularFaseLuaReal(hoje)
                setFaseLuaHoje(resultadoLua)

            } catch (error) {
                console.error("Erro na leitura das órbitas cíclicas:", error)
            } finally {
                setIsLoading(false)
            }
        }

        carregarDashboardCosmico()
    }, [])

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
                    variant="redondo"
                    onClick={() => setIsModalOpen(true)}
                    maxWidth="280px"
                >
                    ◈ Registrar Menstruação
                </Button>
            </div>

            <div className="home-orbita-separador">
                <div className="home-planeta-focal" />
            </div>

            <section className="home-secao-oraculo">
                <span className="home-titulo-menor">✦ ORÁCULO LUNAR ✦</span>
                <h3 className="home-titulo-sessao">MENSAGEM DO COSMOS</h3>
                
                <CardOraculo estaMenstruada={dadosCiclo.estaMenstruada}/>
                <DadosExtras/>
            </section>

            <section className="home-secao-calendario">
                <div className="home-calendario-wrapper">
                    <Calendario reduzido={true} />
                </div>
            </section>
        </div>
    )
}

export default Home