import { useState, useEffect } from "react"
import { sonhosServiceFrontend } from "../services/sonhoService"
import { obterDatasDoPeriodo, converterDataBRParaISO } from "../utils/dateHelper"
import { unificarEFormatarTags } from "../utils/tagHelper"
import { agruparSonhosPorMesEAno } from "../utils/dreamHelper"
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
    const [dataPrimeiroSonho, setDataPrimeiroSonho] = useState(null)

    const LIMITE = 10

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const dados = await sonhosServiceFrontend.listarTodos({})
                if (Array.isArray(dados) && dados.length > 0) {
                    const tagsUnicas = [...new Set(
                        dados.flatMap((sonho) => sonho.tags.map((t) => t.nomeTag.toUpperCase()))
                    )];
                    setTagsDaUsuaria(tagsUnicas)

                    const datas = dados.map(sonho => new Date(sonho.dataSonho).getTime())
                    setDataPrimeiroSonho(new Date(Math.min(...datas)))
                }
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error)
            }
        }
        carregarDadosIniciais()
    }, [])

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

    const carregarProximaPagina = () => setPagina((p) => p + 1)
    
    const dadosProntos = agruparSonhosPorMesEAno(sonhosBrutos, pagina, LIMITE)
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
                        variant="redondo" icone="✦" color="#A58CFF" textColor="#D7CCFF"
                        onClick={() => setModalAberto(true)}
                        backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
                    >
                        REGISTRAR SONHO
                    </Button>
                </div>
            </header>

            <div className="diario-divisor-principal"></div>

            <section className="diario-conteudo">
                <FiltroSonhos 
                    tagsDoUsuario={tagsDaUsuaria} 
                    dataPrimeiroSonho={dataPrimeiroSonho}
                    onFilterChange={setFiltrosAtivos} 
                />

                <LinhaDoTempo 
                    sonhosAgrupados={dadosProntos} 
                    isLoading={isLoading}
                    onCardClick={(id) => console.log(`Abrir visualização: ${id}`)}

                    onDeletarSonho={async (idSonho) => {
                        try {
                            await sonhosServiceFrontend.excluir(idSonho)
                            setSonhosBrutos((antigos) => antigos.filter(s => s.id !== idSonho))
                            console.log(`Sonho ${idSonho} apagado!`)
                        } catch (erro) {
                            console.error(erro);
                            alert("Não foi possível apagar o sonho.")
                        }
                    }}

                    onEditarSonho={async (dadosAtualizados) => {
                        try {
                            const dataFormatada = converterDataBRParaISO(dadosAtualizados.data);
                            const todasAsTags = unificarEFormatarTags(dadosAtualizados.tags, dadosAtualizados.tagsSelecionadas);

                            const payloadBackend = {
                                titulo: dadosAtualizados.titulo,
                                descricao: dadosAtualizados.descricao,
                                dataSonho: dataFormatada, 
                                tags: todasAsTags 
                            };

                            const sonhoAtualizado = await sonhosServiceFrontend.atualizar(dadosAtualizados.id, payloadBackend)
                            
                            setSonhosBrutos((antigos) => {
                                const lista = antigos.map(s => s.id === dadosAtualizados.id ? sonhoAtualizado : s)
                                return lista.sort((a, b) => new Date(b.dataSonho) - new Date(a.dataSonho));
                            })

                            setTagsDaUsuaria(antigas => {
                                const novas = todasAsTags.map(t => t.toUpperCase());
                                return [...new Set([...antigas, ...novas])];
                            })
                        } catch (erro) {
                            console.error(erro);
                            alert("Não foi possível salvar as alterações.")
                        }
                    }}
                />

                {temMaisSonhos && !isLoading && sonhosBrutos.length > 0 && (
                    <div className="diario-wrapper-paginacao">
                        <Button 
                            variant="redondo" icone="✦" color="#A58CFF" textColor="#D7CCFF"
                            onClick={carregarProximaPagina}
                            backgroundColor="linear-gradient(135deg, rgba(110, 76, 163, 0.28) 0%, rgba(75, 45, 115, 0.16) 100%)"
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
                        const dataFormatada = converterDataBRParaISO(dadosNovos.data);
                        const todasAsTags = unificarEFormatarTags(dadosNovos.tags, dadosNovos.tagsSelecionadas);

                        const payloadBackend = {
                            titulo: dadosNovos.titulo,
                            descricao: dadosNovos.descricao,
                            dataSonho: dataFormatada, 
                            tags: todasAsTags
                        };

                        const sonhoCriado = await sonhosServiceFrontend.criar(payloadBackend)
                    
                        setSonhosBrutos(antigos => {
                            const lista = [sonhoCriado, ...antigos];
                            return lista.sort((a, b) => new Date(b.dataSonho) - new Date(a.dataSonho));
                        });

                        setTagsDaUsuaria(antigas => {
                            const novas = todasAsTags.map(t => t.toUpperCase());
                            return [...new Set([...antigas, ...novas])];
                        });
                        
                        setModalAberto(false);
                    } catch (erro) {
                        console.error(erro);
                        alert("Não foi possível registrar o sonho.")
                    }
                }}
            />
        </div>
    )
}

export default Diario