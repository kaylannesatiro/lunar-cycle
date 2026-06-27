import { useState, useEffect } from "react"
import { sonhosServiceFrontend } from "../services/sonhoService"
import FiltroSonhos from "../components/features/Diario/FiltroSonhos"
import LinhaDoTempo from "../components/features/Diario/LinhaTempo"
import Button from "../components/common/Buttons/Button"
import "./Diario.css"

const Diario = () => {
    const [sonhosBrutos, setSonhosBrutos] = useState([])
    const [filtrosAtivos, setFiltrosAtivos] = useState({ periodo: "TODOS", tags: [], datas: null })
    const [isLoading, setIsLoading] = useState(true)
    
    const [ , setModalAberto] = useState(false)

    useEffect(() => {
        async function buscarDados() {
            try {
                setIsLoading(true)
                const dados = await sonhosServiceFrontend.listarTodos()
                
                if (Array.isArray(dados)) {
                    setSonhosBrutos(dados)
                } else {
                    setSonhosBrutos([]) 
                }
            } catch (error) {
                console.error("Erro na comunicação com a API:", error)
                setSonhosBrutos([]) 
            } finally {
                setIsLoading(false)
            }
        }
        buscarDados();
    }, [])

    const tagsDaUsuaria = [...new Set(
        sonhosBrutos.flatMap((sonho) => sonho.tags.map((t) => t.nomeTag.toUpperCase()))
    )];

    const processarSonhosParaATela = () => {
        let filtrados = [...sonhosBrutos];

        if (filtrosAtivos.tags.length > 0) {
            filtrados = filtrados.filter((sonho) => {
                const nomesDasTags = sonho.tags.map(t => t.nomeTag.toUpperCase());
                return filtrosAtivos.tags.every(tagSelecionada => nomesDasTags.includes(tagSelecionada))
            });
        }

        if (filtrosAtivos.periodo !== "TODOS") {
            const hoje = new Date()

            filtrados = filtrados.filter((sonho) => {
                const dataDoSonho = new Date(sonho.dataSonho)
                const periodo = filtrosAtivos.periodo

                if (filtrosAtivos.datas?.inicio && filtrosAtivos.datas?.fim) {
                    const inicio = new Date(filtrosAtivos.datas.inicio)
                    const fim = new Date(filtrosAtivos.datas.fim)
                    fim.setHours(23, 59, 59, 999)
                    return dataDoSonho >= inicio && dataDoSonho <= fim
                }

                if (/^\d{4}$/.test(periodo)) {
                    return dataDoSonho.getFullYear().toString() === periodo
                }

                if (periodo.includes(" ")) {
                    const mesesMap = {
                        Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5,
                        Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11
                    }
                    const [mesTexto, anoTexto] = periodo.split(" ")
                    const mesAlvo = mesesMap[mesTexto]
                    
                    return dataDoSonho.getMonth() === mesAlvo && dataDoSonho.getFullYear().toString() === anoTexto
                }

                if (periodo.includes("a") && periodo.includes("/")) {
                    const [inicioParte, fimParte] = periodo.split(" a ")
                    const [diaIni, mesIni] = inicioParte.split("/").map(Number)
                    const [diaFim, mesFim] = fimParte.split("/").map(Number)

                    const anoAtual = hoje.getFullYear()
                    const dataInicioSemana = new Date(anoAtual, mesIni - 1, diaIni, 0, 0, 0)
                    const dataFimSemana = new Date(anoAtual, mesFim - 1, diaFim, 23, 59, 59)

                    return dataDoSonho >= dataInicioSemana && dataDoSonho <= dataFimSemana
                }

                return true
            })
        }

        const nomesMeses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"]
        const grupos = []

        filtrados.forEach((sonho) => {
            const dataObj = new Date(sonho.dataSonho)
            const mesNome = nomesMeses[dataObj.getMonth()]
            const anoNum = dataObj.getFullYear().toString()
            const diaNum = dataObj.getDate().toString()

            const faseLimpa = sonho.faseLunar.substring(sonho.faseLunar.indexOf(' ') + 1)

            let grupo = grupos.find(g => g.mes === mesNome && g.ano === anoNum)

            if (!grupo) {
                grupo = { mes: mesNome, ano: anoNum, itens: [] }
                grupos.push(grupo)
            }

            grupo.itens.push({
                id: sonho.id,
                diaFormatado: diaNum,
                titulo: sonho.titulo,
                faseLunar: faseLimpa,
                tags: sonho.tags.map(t => t.nomeTag.toUpperCase())
            })
        })

        return grupos
    }

    const dadosProntos = processarSonhosParaATela()

    return (
        <div className="diario-page-container">
            <header className="diario-header">
                <div className="diario-glow-externo"></div>
                <div className="diario-glow-interno"></div>
                
                <div className="diario-header-conteudo">
                    <div className="diario-badge-topo">
                        <span className="diario-estrelas">✦</span>
                        <span className="diario-badge-texto">DIÁRIO DOS SONHOS</span>
                        <span className="diario-estrelas">✦</span>
                    </div>
                    
                    <h1 className="diario-titulo-principal">MEUS SONHOS</h1>
                    
                    <p className="diario-subtitulo">
                        "A lua guarda os segredos que sua alma sussurrou<br/>enquanto você sonhava."
                    </p>
                    
                    <Button 
                        variant="redondo" 
                        icone="✦"
                        backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
                        color="#A58CFF" 
                        textColor="#D7CCFF"
                        onClick={() => setModalAberto(true)}
                    >
                        REGISTRAR SONHO
                    </Button>
                </div>
            </header>

            <div className="diario-divisor-principal"></div>

            <section className="diario-conteudo">
                <FiltroSonhos 
                    tagsDoUsuario={tagsDaUsuaria} 
                    onFilterChange={setFiltrosAtivos} 
                />
                
                <LinhaDoTempo 
                    sonhosAgrupados={dadosProntos} 
                    isLoading={isLoading} 
                    onCardClick={(id) => console.log(`Abrir visualização do sonho: ${id}`)}
                />
            </section>
        </div>
    )
}

export default Diario