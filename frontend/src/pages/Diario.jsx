import { useState, useEffect } from "react"
import { sonhosServiceFrontend } from "../services/sonhoService"
import FiltroSonhos from "../components/features/Diario/FiltroSonhos"
import LinhaDoTempo from "../components/features/Diario/LinhaTempo"
import Button from "../components/common/Buttons/Button"
import ModalSonho from "../components/features/Modals/ModalSonho"
import "./Diario.css"

const Diario = () => {
    const [sonhosBrutos, setSonhosBrutos] = useState([])
    const [tagsDaUsuaria, setTagsDaUsuaria] = useState([])
    const [filtrosAtivos, setFiltrosAtivos] = useState({ periodo: "TODOS", tags: [], datas: null })
    const [isLoading, setIsLoading] = useState(true)
    const [pagina, setPagina] = useState(1)
    const [modalAberto, setModalAberto] = useState(false)

    const LIMITE = 10

    useEffect(() => {
        async function carregarTagsIniciais() {
            try {
                const dados = await sonhosServiceFrontend.listarTodos({})
                
                if (Array.isArray(dados)) {
                    const tagsUnicas = [...new Set(
                        dados.flatMap((sonho) => sonho.tags.map((t) => t.nomeTag.toUpperCase()))
                    )];
                    setTagsDaUsuaria(tagsUnicas)
                }
            } catch (error) {
                console.error("Erro ao mapear tags da usuária:", error)
            }
        }
        carregarTagsIniciais()
    }, [])

    const obterDatasDoPeriodo = (periodo, datas) => {
        if (datas?.inicio && datas?.fim) {
            return { dataInicio: datas.inicio, dataFim: datas.fim };
        }
        
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        
        if (/^\d{4}$/.test(periodo)) {
            return { dataInicio: `${periodo}-01-01`, dataFim: `${periodo}-12-31` };
        }
        
        if (periodo.includes(" ")) {
            const mesesMap = {
                Jan: "01", Fev: "02", Mar: "03", Abr: "04", Mai: "05", Jun: "06",
                Jul: "07", Ago: "08", Set: "09", Out: "10", Nov: "11", Dez: "12"
            }

            const [mesTexto, anoTexto] = periodo.split(" ")
            const mesDigito = mesesMap[mesTexto]

            if (mesDigito) {
                const ultimoDia = new Date(Number(anoTexto), Number(mesDigito), 0).getDate()

                return { 
                    dataInicio: `${anoTexto}-${mesDigito}-01`, 
                    dataFim: `${anoTexto}-${mesDigito}-${String(ultimoDia).padStart(2, '0')}` 
                }
            }
        }
        
        if (periodo.includes("a") && periodo.includes("/")) {
            const [inicioParte, fimParte] = periodo.split(" a ")
            const [diaIni, mesIni] = inicioParte.split("/").map(Number)
            const [diaFim, mesFim] = fimParte.split("/").map(Number)
            
            const dIni = `${anoAtual}-${String(mesIni).padStart(2, '0')}-${String(diaIni).padStart(2, '0')}`
            const dFim = `${anoAtual}-${String(mesFim).padStart(2, '0')}-${String(diaFim).padStart(2, '0')}`
            return { dataInicio: dIni, dataFim: dFim }
        }
        
        return { dataInicio: undefined, dataFim: undefined }
    };

    useEffect(() => {
        async function buscarDadosFiltrados() {
            try {
                setIsLoading(true)
                const tagParam = filtrosAtivos.tags.length > 0 ? filtrosAtivos.tags.join(',') : undefined
                const { dataInicio, dataFim } = obterDatasDoPeriodo(filtrosAtivos.periodo, filtrosAtivos.datas)
                
                const queryParams = {}
                if (tagParam) queryParams.tag = tagParam
                if (dataInicio) queryParams.dataInicio = dataInicio
                if (dataFim) queryParams.dataFim = dataFim
                
                const dados = await sonhosServiceFrontend.listarTodos(queryParams);
                
                if (Array.isArray(dados)) {
                    setSonhosBrutos(dados)
                    setPagina(1)
                }
            } catch (error) {
                console.error("Erro ao consultar a listagem de sonhos do backend:", error)
                setSonhosBrutos([])
            } finally {
                setIsLoading(false)
            }
        }
        buscarDadosFiltrados()
    }, [filtrosAtivos])

    const processarSonhosParaATela = () => {
        const limiteExibicao = pagina * LIMITE;
        const sonhosFatiados = sonhosBrutos.slice(0, limiteExibicao)
        
        const nomesMeses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
        const grupos = []

        sonhosFatiados.forEach((sonho) => {
            const dataObj = new Date(sonho.dataSonho)
            
            const mesNome = nomesMeses[dataObj.getUTCMonth()]
            const anoNum = dataObj.getUTCFullYear().toString()
            const diaNum = dataObj.getUTCDate().toString()

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

    const carregarProximaPagina = () => setPagina((p) => p + 1)
    
    const dadosProntos = processarSonhosParaATela()
    const temMaisSonhos = sonhosBrutos.length > pagina * LIMITE

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
                    onCardClick={(id) => console.log(`Abrir visualização: ${id}`)}

                    onDeletarSonho={async (idSonho) => {
                        try {
                            await sonhosServiceFrontend.excluir(idSonho)
                            
                            setSonhosBrutos((sonhosAntigos) => 
                                sonhosAntigos.filter(sonho => sonho.id !== idSonho)
                            )
                            
                            console.log(`Sonho ${idSonho} apagado com sucesso!`)
                        } catch (erro) {
                            console.error("Erro ao apagar sonho:", erro)
                            alert("Não foi possível apagar o sonho. Tente novamente.")
                        }
                    }}

                    onEditarSonho={async (dadosAtualizados) => {
                        try {
                            const sonhoAtualizado = await sonhosServiceFrontend.atualizar(dadosAtualizados.id, dadosAtualizados)
                            
                            console.log("Sonho atualizado no backend:", sonhoAtualizado)
                            
                            setSonhosBrutos((sonhosAntigos) => 
                                sonhosAntigos.map(sonho => 
                                    sonho.id === dadosAtualizados.id ? sonhoAtualizado : sonho
                                )
                            )
                        } catch (erro) {
                            console.error("Erro ao editar o sonho:", erro)
                            alert("Não foi possível salvar as alterações.")
                        }
                    }}
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

            <ModalSonho 
                isOpen={modalAberto}
                modo="criar"
                onFechar={() => setModalAberto(false)}
                onSave={async (dadosNovos) => {
                    try {
                        const sonhoCriado = await sonhosServiceFrontend.criar(dadosNovos)
                        
                        console.log("Novo sonho salvo no banco:", sonhoCriado)
                    
                        setSonhosBrutos(sonhosAntigos => [sonhoCriado, ...sonhosAntigos])
                        
                        setModalAberto(false);
                    } catch (erro) {
                        console.error("Erro ao criar novo sonho:", erro)
                        alert("Não foi possível registrar o sonho. Tente novamente.")
                    }
                }}
            />
        </div>
    )
}

export default Diario