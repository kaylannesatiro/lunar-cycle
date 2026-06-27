import "./Diario.css"
import { useState, useEffect } from "react"
import FiltroSonhos from "../components/features/Diario/FiltroSonhos"
import LinhaDoTempo from "../components/features/Diario/LinhaTempo"
import Button from "../components/common/Buttons/Button"

const Diario = () => {
    const [sonhosBrutos, setSonhosBrutos] = useState([])
    const [filtrosAtivos, setFiltrosAtivos] = useState({ periodo: "TODOS", tags: [], datas: null })
    const [isLoading, setIsLoading] = useState(true)
    
    const [ , setModalAberto] = useState(false)

    useEffect(() => {
        async function buscarDados() {
            try {
                setIsLoading(true)
                
                // ─── COLE O MOCK AQUI DENTRO PARA TESTAR ───
                const dados = [
                  {
                    id: 1,
                    titulo: "O JARDIM DE CRISTAL",
                    descricao: "Caminhava por um jardim onde as flores eram feitas de quartzo ametista e reluziam com a luz do luar.",
                    dataSonho: "2026-06-04T12:00:00.000Z",
                    faseLunar: "🌘 Minguante",
                    tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "NATUREZA" }, { nomeTag: "PAZ" }, { nomeTag: "LUZ" }]
                  },
                  {
                    id: 2,
                    titulo: "A BIBLIOTECA INFINITA",
                    descricao: "Livros flutuavam e as paredes eram feitas de constelações que se moviam devagar.",
                    dataSonho: "2026-06-02T12:00:00.000Z",
                    faseLunar: "🌗 Quarto Minguante",
                    tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "INFINITO" }, { nomeTag: "SABEDORIA" }, { nomeTag: "PROFÉTICO" }]
                  },
                  {
                    id: 3,
                    titulo: "VÔO SOBRE AS NUVENS ROXAS",
                    descricao: "Constatei que estava sonhando e decidi voar o mais alto que podia até tocar as estrelas.",
                    dataSonho: "2026-06-15T12:00:00.000Z",
                    faseLunar: "🌒 Crescente",
                    tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "LIBERDADE" }, { nomeTag: "ÊXTASE" }]
                  },
                  {
                    id: 4,
                    titulo: "O TEMPLO ESCONDIDO",
                    descricao: "Encontrei uma fenda em uma caverna que dava para um templo antigo com uma estátua lunar gigante.",
                    dataSonho: "2026-06-12T12:00:00.000Z",
                    faseLunar: "🌓 Quarto Crescente",
                    tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "SABEDORIA" }, { nomeTag: "PORTAL" }]
                  },
                  {
                    id: 5,
                    titulo: "DANÇA COM A LUA",
                    descricao: "Uma celebração ao redor de uma fogueira azul onde nossos reflexos flutuavam no ar.",
                    dataSonho: "2026-05-29T12:00:00.000Z",
                    faseLunar: "🌕 Cheia",
                    tags: [{ nomeTag: "ESPIRITUAL" }, { nomeTag: "DANÇA" }, { nomeTag: "LUA CHEIA" }, { nomeTag: "ÊXTASE" }]
                  },
                  {
                    id: 6,
                    titulo: "AS PORTAS DO AMANHECER",
                    descricao: "Grandes portões dourados se abriam no horizonte revelando o que parecia ser o futuro.",
                    dataSonho: "2026-05-24T12:00:00.000Z",
                    faseLunar: "🌓 Quarto Crescente",
                    tags: [{ nomeTag: "TRANSFORMAÇÃO" }, { nomeTag: "FUTURO" }, { nomeTag: "PORTAL" }, { nomeTag: "INTUIÇÃO" }]
                  },
                  {
                    id: 7,
                    titulo: "O MAR DE ESTRELAS FLUIDAS",
                    descricao: "A água do mar brilhava intensamente em tons de azul neon a cada onda que quebrava na areia.",
                    dataSonho: "2026-05-20T12:00:00.000Z",
                    faseLunar: "🌔 Gibosa Crescente",
                    tags: [{ nomeTag: "PAZ" }, { nomeTag: "INFINITO" }, { nomeTag: "NATUREZA" }]
                  },
                  {
                    id: 8,
                    titulo: "ENCONTRO COM O ANIMAL GUIA",
                    descricao: "Um lobo branco de olhos brilhantes caminhava ao meu lado na floresta silenciosa em total comunhão.",
                    dataSonho: "2026-05-15T12:00:00.000Z",
                    faseLunar: "🌑 Nova",
                    tags: [{ nomeTag: "NATUREZA" }, { nomeTag: "INTUIÇÃO" }, { nomeTag: "ESPIRITUAL" }]
                  },
                  {
                    id: 9,
                    titulo: "O RELÓGIO SEM PONTEIROS",
                    descricao: "Um relógio de areia gigante flutuava no deserto e a areia subia em vez de cair.",
                    dataSonho: "2026-05-05T12:00:00.000Z",
                    faseLunar: "🌘 Minguante",
                    tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "TEMPO" }, { nomeTag: "INFINITO" }]
                  },
                  {
                    id: 10,
                    titulo: "CAMINHO DE FLORES BRANCAS",
                    descricao: "Onde eu pisava, nasciam flores brancas instantaneamente exalando um perfume maravilhoso.",
                    dataSonho: "2026-04-28T12:00:00.000Z",
                    faseLunar: "🌕 Cheia",
                    tags: [{ nomeTag: "NATUREZA" }, { nomeTag: "LUZ" }, { nomeTag: "PAZ" }]
                  },
                  {
                    id: 11,
                    titulo: "VOZES ECOANDO NO VENTO",
                    descricao: "O vento soprava sussurros em uma língua antiga que eu não entendia mas conseguia sentir o significado.",
                    dataSonho: "2026-04-22T12:00:00.000Z",
                    faseLunar: "🌗 Quarto Minguante",
                    tags: [{ nomeTag: "INTUIÇÃO" }, { nomeTag: "MISTERIOSO" }, { nomeTag: "ESPIRITUAL" }]
                  },
                  {
                    id: 12,
                    titulo: "A CHAVE DE OURO ANTIGA",
                    descricao: "Recebi de uma figura encapuzada uma chave pesada que supostamente abre qualquer segredo da mente.",
                    dataSonho: "2026-04-15T12:00:00.000Z",
                    faseLunar: "🌑 Nova",
                    tags: [{ nomeTag: "PORTAL" }, { nomeTag: "SABEDORIA" }, { nomeTag: "FUTURO" }]
                  },
                  {
                    id: 13,
                    titulo: "O ESPELHO DO DESTINO",
                    descricao: "Ao olhar no espelho, vi reflexos de vidas passadas flutuando sobre a minha própria imagem.",
                    dataSonho: "2026-04-10T12:00:00.000Z",
                    faseLunar: "🌒 Crescente",
                    tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "INTUIÇÃO" }, { nomeTag: "TRANSFORMAÇÃO" }]
                  },
                  {
                    id: 14,
                    titulo: "VOO DA CORUJA NEGRA",
                    descricao: "Eu conseguia ver através dos olhos de uma coruja voando alto sobre uma floresta densa.",
                    dataSonho: "2026-04-05T12:00:00.000Z",
                    faseLunar: "🌖 Gibosa Minguante",
                    tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "LIBERDADE" }, { nomeTag: "INTUIÇÃO" }]
                  },
                  {
                    id: 15,
                    titulo: "DESPERTAR CÓSMICO",
                    descricao: "Tudo ao meu redor desintegrou em poeira cósmica colorida e senti uma paz indescritível.",
                    dataSonho: "2026-04-01T12:00:00.000Z",
                    faseLunar: "🌑 Nova",
                    tags: [{ nomeTag: "ESPIRITUAL" }, { nomeTag: "LUZ" }, { nomeTag: "ÊXTASE" }]
                  }
                ];

                setSonhosBrutos(dados)
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