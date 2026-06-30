import { useState } from "react"
import { obterFaseLunar } from "../../utils/fasesLunares"

import CardOraculo from "../../components/features/Ciclo/CardOraculo"
import DadosExtras from "../../components/features/Ciclo/DadosExtras"
import Calendario from "../../components/features/Calendario/Calendario"
import AnimacaoLua from "../../components/common/Animation/AnimacaoLua"
import "../../pages/private/Home.css" 

const HomePublic = () => {
    const hoje = new Date()
    const faseLunarAtual = obterFaseLunar(hoje)

    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())

    const diaDestaque = String(hoje.getDate()).padStart(2, '0')
    const mesSubtitulo = hoje.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
    const anoFrase = hoje.getFullYear()

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
                        estaMenstruada={false}
                        faseLunar={(faseLunarAtual.nome)}
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
                    diasMenstruacao={[]}
                    diasPrevistos={[]}
                    fasesLunares={{}}
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
            </section>
        </div>
    )
}

export default HomePublic