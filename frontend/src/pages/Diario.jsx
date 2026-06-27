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
    const [pagina, setPagina] = useState(1)
    const [temMaisSonhos, setTemMaisSonhos] = useState(true)
    const [, setModalAberto] = useState(false)

    // O BANCO DE DADOS GIGANTE FAKE (30 Itens)
    const MOCK_GRANDE = [
        // JUNHO 2026
        { id: 1, titulo: "O JARDIM DE CRISTAL", descricao: "Flores de quartzo reluzentes.", dataSonho: "2026-06-25T12:00:00.000Z", faseLunar: "🌒 Crescente", tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "NATUREZA" }] },
        { id: 2, titulo: "A BIBLIOTECA INFINITA", descricao: "Livros flutuando no cosmo.", dataSonho: "2026-06-22T12:00:00.000Z", faseLunar: "🌓 Quarto Crescente", tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "SABEDORIA" }] },
        { id: 3, titulo: "VÔO NAS NUVENS ROXAS", descricao: "Voando sem asas no céu lilás.", dataSonho: "2026-06-18T12:00:00.000Z", faseLunar: "🌔 Gibosa Crescente", tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "LIBERDADE" }] },
        { id: 4, titulo: "O TEMPLO DA LUA", descricao: "Ruínas antigas iluminadas.", dataSonho: "2026-06-15T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "ESPIRITUAL" }, { nomeTag: "PORTAL" }] },
        { id: 5, titulo: "DANÇA DAS SOMBRAS", descricao: "Sombras ganharam vida própria.", dataSonho: "2026-06-12T12:00:00.000Z", faseLunar: "🌗 Quarto Minguante", tags: [{ nomeTag: "MISTERIOSO" }] },
        { id: 6, titulo: "CHAVE DOS SEGREDOS", descricao: "Uma chave que abria portais.", dataSonho: "2026-06-09T12:00:00.000Z", faseLunar: "🌘 Minguante", tags: [{ nomeTag: "SABEDORIA" }, { nomeTag: "PORTAL" }] },
        { id: 7, titulo: "ESCREVENDO NAS ESTRELAS", descricao: "Meus dedos deixavam rastro de luz.", dataSonho: "2026-06-06T12:00:00.000Z", faseLunar: "🌑 Nova", tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "LUZ" }] },
        { id: 8, titulo: "O LABIRINTO DE VIDRO", descricao: "Reflexos que mostravam o futuro.", dataSonho: "2026-06-04T12:00:00.000Z", faseLunar: "🌒 Crescente", tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "FUTURO" }] },
        { id: 9, titulo: "O RIO DE PRATA", descricao: "Água líquida e brilhante como mercúrio.", dataSonho: "2026-06-02T12:00:00.000Z", faseLunar: "🌓 Quarto Crescente", tags: [{ nomeTag: "NATUREZA" }, { nomeTag: "PAZ" }] },
        
        // MAIO 2026
        { id: 10, titulo: "PEIXES FLUTUANTES", descricao: "Baleias e peixes nadando no ar.", dataSonho: "2026-05-29T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "LIBERDADE" }, { nomeTag: "NATUREZA" }] },
        { id: 11, titulo: "AS PORTAS DO AMANHECER", descricao: "Portões de ouro abrindo no horizonte.", dataSonho: "2026-05-26T12:00:00.000Z", faseLunar: "🌔 Gibosa Minguante", tags: [{ nomeTag: "PORTAL" }, { nomeTag: "FUTURO" }] },
        { id: 12, titulo: "O TREM DO TEMPO", descricao: "Viajando por estações antigas.", dataSonho: "2026-05-22T12:00:00.000Z", faseLunar: "🌗 Quarto Minguante", tags: [{ nomeTag: "MISTERIOSO" }] },
        { id: 13, titulo: "O LOBO BRANCO", descricao: "Um guia espiritual na floresta.", dataSonho: "2026-05-18T12:00:00.000Z", faseLunar: "🌑 Nova", tags: [{ nomeTag: "ESPIRITUAL" }, { nomeTag: "NATUREZA" }] },
        { id: 14, titulo: "O MERCADO MÁGICO", descricao: "Vendiam poções e frascos de névoa.", dataSonho: "2026-05-15T12:00:00.000Z", faseLunar: "🌒 Crescente", tags: [{ nomeTag: "MISTERIOSO" }] },
        { id: 15, titulo: "MÚSICA DO SILÊNCIO", descricao: "Uma melodia que tocava na mente.", dataSonho: "2026-05-12T12:00:00.000Z", faseLunar: "🌓 Quarto Crescente", tags: [{ nomeTag: "PAZ" }] },
        { id: 16, titulo: "CIDADES FLUTUANTES", descricao: "Prédios sustentados por nuvens.", dataSonho: "2026-05-09T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "LIBERDADE" }, { nomeTag: "PORTAL" }] },
        { id: 17, titulo: "A AMPULHETA INVERTIDA", descricao: "O tempo correndo para trás.", dataSonho: "2026-05-06T12:00:00.000Z", faseLunar: "🌗 Quarto Minguante", tags: [{ nomeTag: "MISTERIOSO" }] },
        { id: 18, titulo: "O SUSSURRO DO VENTO", descricao: "Segredos soprados nas folhas.", dataSonho: "2026-05-02T12:00:00.000Z", faseLunar: "🌑 Nova", tags: [{ nomeTag: "NATUREZA" }] },

        // ABRIL 2026
        { id: 19, titulo: "CORREDIÇAS DE LUZ", descricao: "Escorregando por fios de aurora boreal.", dataSonho: "2026-04-28T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "LÚCIDO" }, { nomeTag: "LUZ" }] },
        { id: 20, titulo: "O ESPELHO QUE FALA", descricao: "Meu reflexo respondia minhas dúvidas.", dataSonho: "2026-04-25T12:00:00.000Z", faseLunar: "🌔 Gibosa Minguante", tags: [{ nomeTag: "SABEDORIA" }] },
        { id: 21, titulo: "A MONTANHA CÓSMICA", descricao: "Escalando até alcançar o vácuo.", dataSonho: "2026-04-22T12:00:00.000Z", faseLunar: "🌗 Quarto Minguante", tags: [{ nomeTag: "ESPIRITUAL" }] },
        { id: 22, titulo: "PINGOS DE CHUVA PARADOS", descricao: "A água congelada no ar.", dataSonho: "2026-04-18T12:00:00.000Z", faseLunar: "🌑 Nova", tags: [{ nomeTag: "MISTERIOSO" }, { nomeTag: "PAZ" }] },
        { id: 23, titulo: "O FAROL NO DESERTO", descricao: "Guiando barcos que andavam na areia.", dataSonho: "2026-04-15T12:00:00.000Z", faseLunar: "🌒 Crescente", tags: [{ nomeTag: "PORTAL" }] },
        { id: 24, titulo: "FLORESTA DE VELAS", descricao: "Árvores feitas de cera derretida.", dataSonho: "2026-04-12T12:00:00.000Z", faseLunar: "🌓 Quarto Crescente", tags: [{ nomeTag: "NATUREZA" }] },
        { id: 25, titulo: "O XAMÃ DA LUA", descricao: "Recebendo uma pintura mística na testa.", dataSonho: "2026-04-09T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "ESPIRITUAL" }, { nomeTag: "SABEDORIA" }] },
        { id: 26, titulo: "A PONTE INVISÍVEL", descricao: "Andando no vazio com passos firmes.", dataSonho: "2026-04-06T12:00:00.000Z", faseLunar: "🌗 Quarto Minguante", tags: [{ nomeTag: "PORTAL" }] },
        { id: 27, titulo: "TAPETE DE BORBOLETAS", descricao: "Voando montado em milhares de asas.", dataSonho: "2026-04-04T12:00:00.000Z", faseLunar: "🌑 Nova", tags: [{ nomeTag: "LIBERDADE" }, { nomeTag: "NATUREZA" }] },
        { id: 28, titulo: "O PORTAL DOS SUSSURROS", descricao: "Onde as memórias viram fumaça.", dataSonho: "2026-04-03T12:00:00.000Z", faseLunar: "🌒 Crescente", tags: [{ nomeTag: "PORTAL" }, { nomeTag: "MISTERIOSO" }] },
        { id: 29, titulo: "PINGUINS DE FOGO", descricao: "Criaturas místicas no gelo aquecido.", dataSonho: "2026-04-02T12:00:00.000Z", faseLunar: "🌓 Quarto Crescente", tags: [{ nomeTag: "NATUREZA" }] },
        { id: 30, titulo: "DESPERTAR FINAL", descricao: "O universo piscando e sumindo.", dataSonho: "2026-04-01T12:00:00.000Z", faseLunar: "🌕 Cheia", tags: [{ nomeTag: "LUZ" }, { nomeTag: "PAZ" }] }
    ];

    const LIMITE = 10;

    useEffect(() => {
        setIsLoading(true);
        const primeiraFatia = MOCK_GRANDE.slice(0, LIMITE);
        setSonhosBrutos(primeiraFatia);
        setIsLoading(false);
    }, []);

    const carregarProximaPagina = () => {
        const proximaPagina = pagina + 1;
        const indiceInicio = pagina * LIMITE;
        const indiceFim = indiceInicio + LIMITE;
        
        const fatiaNova = MOCK_GRANDE.slice(indiceInicio, indiceFim);
        
        if (fatiaNova.length > 0) {
            setSonhosBrutos((anteriores) => [...anteriores, ...fatiaNova]);
            setPagina(proximaPagina);
        }
        
        if (indiceFim >= MOCK_GRANDE.length) {
            setTemMaisSonhos(false);
        }
    };

    const tagsDaUsuaria = [...new Set(
        MOCK_GRANDE.flatMap((sonho) => sonho.tags.map((t) => t.nomeTag.toUpperCase()))
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
                    
                    <h1 className="diario-titulo-principal">MEUS<br/>SONHOS</h1>
                    
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
                {!isLoading && sonhosBrutos.length > 0 && (
                    <FiltroSonhos 
                        tagsDoUsuario={tagsDaUsuaria} 
                        onFilterChange={setFiltrosAtivos} 
                    />
                )}
                
                <LinhaDoTempo 
                    sonhosAgrupados={dadosProntos} 
                    isLoading={isLoading} 
                    onCardClick={(id) => console.log(`Abrir visualização do sonho: ${id}`)}
                />

                {temMaisSonhos && !isLoading && sonhosBrutos.length > 0 && (
                    <div className="diario-wrapper-paginacao">
                        <Button 
                            variant="redondo" 
                            icone="✦"
                            backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
                            color="#A58CFF" 
                            textColor="#D7CCFF"
                            onClick={carregarProximaPagina}
                        >
                            Carregar Mais Sonhos
                        </Button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Diario