import "./Diario.css"
import { useState, useEffect } from "react"
import { sonhosService} from "../../../backend/services/sonhoService"
import FiltroSonhos from "../components/features/Diario/FiltroSonhos"
import LinhaDoTempo from "../components/features/Diario/LinhaTempo"

const Diario = () => {
    const [sonhosBrutos, setSonhosBrutos] = useState([])
    const [filtrosAtivos, setFiltrosAtivos] = useState({ periodo: "TODOS", tags: [], datas: null })
    const [isLoading, setIsLoading] = useState(true)
    
    const [modalAberto, setModalAberto] = useState(false)

    useEffect(() => {
        async function buscarDados() {
            try {
                setIsLoading(true)
                const dados = await sonhosService.listarTodos()
                setSonhosBrutos(dados)
            } catch (error) {
                console.error("Erro na comunicação com a API:", error)
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

                if (filtrosAtivos.datas && filtrosAtivos.datas.inicio && filtrosAtivos.datas.fim) {
                    const inicio = new Date(filtrosAtivos.datas.inicio)
                    const fim = new Date(filtrosAtivos.datas.fim)
                    fim.setHours(23, 59, 59, 999)
                    return dataDoSonho >= inicio && dataDoSonho <= fim
                }

                if (filtrosAtivos.periodo === "SEMANA") {
                    const semanaPassada = new Date()
                    semanaPassada.setDate(hoje.getDate() - 7)
                    return dataDoSonho >= semanaPassada
                }

                if (filtrosAtivos.periodo === "MÊS") {
                    const mesPassado = new Date()
                    mesPassado.setMonth(hoje.getMonth() - 1)
                    return dataDoSonho >= mesPassado
                }

                if (filtrosAtivos.periodo === "ANO") {
                    const anoPassado = new Date()
                    anoPassado.setFullYear(hoje.getFullYear() - 1)
                    return dataDoSonho >= anoPassado;
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
                <div className="diario-badge-topo">
                    <span className="diario-estrelas">✦</span>
                    <span className="diario-badge-texto">DIÁRIO DOS SONHOS</span>
                    <span className="diario-estrelas">✦</span>
                </div>
            
                <h1 className="diario-titulo-principal">MEUS<br/>SONHOS</h1>
            
                <p className="diario-subtitulo">
                    "A lua guarda os segredos que sua alma sussurrou<br/>enquanto você sonhava."
                </p>
            
                <button 
                    className="diario-btn-registrar" 
                    onClick={() => setModalAberto(true)}
                >
                    ✦ REGISTRAR SONHO
                </button>
            </header>

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