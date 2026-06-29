import { useState, useEffect } from "react"
import { cicloService } from "../../services/cicloService"
import { usuariaService } from "../../services/userService"
import { gerarIntervaloDeDatas } from "../../utils/calculosDate"

import Button from "../../components/common/Buttons/Button"
import Calendario from "../../components/features/Calendario/Calendario"
import ModalMenstruacao from "../../components/features/Modals/ModalMenstruacao"
import PopupConfirmacao from "../../components/common/Modals/PopupConfirmacao"
import "./Calendario.css"

const CalendarioPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalModo, setModalModo] = useState("registrar")
    const [dadosIniciaisModal, setDadosIniciaisModal] = useState({})
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [duracaoUsuaria, setDuracaoUsuaria] = useState(5)

    const hoje = new Date()
    const [mesFiltro, setMesFiltro] = useState(hoje.getMonth() + 1)
    const [anoFiltro, setAnoFiltro] = useState(hoje.getFullYear())
    const [dadosCalendario, setDadosCalendario] = useState({ dias: [] })

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true)

            try {
                const mesFormatado = String(mesFiltro).padStart(2, '0')
                const dadosBrutos = await cicloService.obterCalendario(mesFormatado, anoFiltro)
                setDadosCalendario(dadosBrutos)
            } catch (error) {
                console.error("Erro ao carregar calendário:", error)
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

        carregarDados()
    }, [mesFiltro, anoFiltro])

    useEffect(() => {
        if (isModalOpen || isPopupOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            document.documentElement.style.overflow = 'auto'
        }
    }, [isModalOpen, isPopupOpen])

    const listaDias = dadosCalendario?.dias || []

    const diasMenstruacaoFormatados = listaDias
        .filter(d => d.registrada === true)
        .map(d => d.data)

    const diasPrevistosFormatados = listaDias
        .filter(d => d.prevista === true)
        .map(d => d.data)

    const handleDayClick = (dataStrISO) => {
        const isRegistrada = diasMenstruacaoFormatados.includes(dataStrISO)
        const duracaoEfetiva = duracaoUsuaria || 5

        const formatarParaBR = (strISO) => {
            const [ano, mes, dia] = strISO.split('-')
            return `${dia}/${mes}/${ano}`
        }

        if (isRegistrada) {
            setModalModo("editar")

            let inicioContiguo = dataStrISO
            let dataInicioObj = new Date(dataStrISO + 'T12:00:00')
            while (true) {
                dataInicioObj.setDate(dataInicioObj.getDate() - 1)
                const isoAnterior = dataInicioObj.toISOString().split('T')[0]
                if (diasMenstruacaoFormatados.includes(isoAnterior)) {
                    inicioContiguo = isoAnterior
                } else {
                    break
                }
            }

            let fimContiguo = dataStrISO
            let dataFimObj = new Date(dataStrISO + 'T12:00:00')
            while (true) {
                dataFimObj.setDate(dataFimObj.getDate() + 1)
                const isoProximo = dataFimObj.toISOString().split('T')[0]
                if (diasMenstruacaoFormatados.includes(isoProximo)) {
                    fimContiguo = isoProximo
                } else {
                    break
                }
            }

            setDadosIniciaisModal({
                dataInicio: formatarParaBR(inicioContiguo),
                dataFim: formatarParaBR(fimContiguo)
            })
        } else {
            setModalModo("registrar")

            const [ano, mes, dia] = dataStrISO.split('-')
            const dataInicioObj = new Date(Number(ano), Number(mes) - 1, Number(dia))

            const dataFimObj = new Date(dataInicioObj.getTime())
            dataFimObj.setDate(dataFimObj.getDate() + (duracaoEfetiva - 1))

            const diaF = String(dataFimObj.getDate()).padStart(2, '0')
            const mesF = String(dataFimObj.getMonth() + 1).padStart(2, '0')
            const dataFimBR = `${diaF}/${mesF}/${dataFimObj.getFullYear()}`

            setDadosIniciaisModal({
                dataInicio: formatarParaBR(dataStrISO),
                dataFim: dataFimBR
            })
        }
        setIsModalOpen(true)
    }

    const handleSalvarModal = async (dadosDoModal) => {
        try {
            const duracaoEfetiva = duracaoUsuaria || 5

            const diasAntigos = modalModo === "editar"
                ? gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim, duracaoEfetiva)
                : []

            const diasNovos = gerarIntervaloDeDatas(dadosDoModal.dataInicio, dadosDoModal.dataFim, duracaoEfetiva)

            const diasParaDesmarcar = diasAntigos.filter(dia => !diasNovos.includes(dia))
            const diasParaMarcar = diasNovos.filter(dia => !diasAntigos.includes(dia) && !diasMenstruacaoFormatados.includes(dia))

            let ultimoCalendario = dadosCalendario

            for (const diaISO of diasParaDesmarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            for (const diaISO of diasParaMarcar) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            setDadosCalendario(ultimoCalendario)
            setIsModalOpen(false)
        } catch (error) {
            console.error("Erro ao salvar/editar período:", error)
        }
    }

    const abrirPopupApagar = () => {
        setIsPopupOpen(true)
    }

    const confirmarApagarPerido = async () => {
        try {
            const duracaoEfetiva = duracaoUsuaria || 5
            const diasAntigos = gerarIntervaloDeDatas(dadosIniciaisModal.dataInicio, dadosIniciaisModal.dataFim, duracaoEfetiva)
            let ultimoCalendario = dadosCalendario

            for (const diaISO of diasAntigos) {
                const resposta = await cicloService.alternarMenstruacaoDia(diaISO, mesFiltro, anoFiltro)
                ultimoCalendario = resposta.calendario || resposta
            }

            setDadosCalendario(ultimoCalendario)
            setIsPopupOpen(false)
            setIsModalOpen(false)
        } catch (error) {
            console.error("Erro ao apagar período:", error)
        }
    }

    const normalizarFaseParaComponente = (nomeFaseBackend) => {
        if (!nomeFaseBackend) return "Nova"
        if (nomeFaseBackend.includes("Crescente Côncava")) return "Crescente"
        if (nomeFaseBackend.includes("Minguante Côncava")) return "Minguante"
        return nomeFaseBackend
    }

    const dicionarioFasesLunares = listaDias.reduce((acc, d) => {
        if (!d.data) return acc
        acc[d.data] = normalizarFaseParaComponente(d.faseLunar?.nome || d.faseLunar)
        return acc
    }, {})

    if (isLoading) return <div className="cal-page-loading">Sintonizando marés e ciclos lunares...</div>

    return (
        <div className="cal-page-shell">
            <main className="cal-page-main-content">
                <Calendario
                    mesAtual={mesFiltro - 1}
                    anoAtual={anoFiltro}
                    diasMenstruacao={diasMenstruacaoFormatados}
                    diasPrevistos={diasPrevistosFormatados}
                    fasesLunares={dicionarioFasesLunares}
                    onDayClick={handleDayClick}
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

                <div className="cal-page-action-area">
                    <Button
                        variant="redondo"
                        maxWidth="280px"
                        onClick={() => {
                            setModalModo("registrar")
                            setDadosIniciaisModal({ dataInicio: "", dataFim: "" })
                            setIsModalOpen(true)
                        }}
                    >
                        ◈ Registrar Menstruação
                    </Button>
                </div>
            </main>

            <ModalMenstruacao
                isOpen={isModalOpen}
                modo={modalModo}
                dadosIniciais={dadosIniciaisModal}
                onFechar={() => setIsModalOpen(false)}
                onSave={handleSalvarModal}
                onDelete={abrirPopupApagar}
            />

            <PopupConfirmacao
                isOpen={isPopupOpen}
                title="Apagar Ciclo"
                message="Tem certeza que deseja apagar este registro? Esta ação não pode ser desfeita."
                variante="perigo"
                backgroundColor="radial-gradient(111.8% 111.8% at 50% 0%, rgba(150, 22, 32, 0.08) 0%, rgba(0, 0, 0, 0.00) 58%)"
                textColor="#F5F0E9"
                onCancel={() => setIsPopupOpen(false)}
                botaoCancelar={
                    <Button
                        variant="padrao"
                        backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                        textColor="#E0C58F"
                        color="rgba(224, 197, 143, 0.50)"
                        onClick={() => setIsPopupOpen(false)}
                        width="8rem"
                    >
                        Cancelar
                    </Button>
                }
                botaoConfirmar={
                    <Button
                        variant="padrao"
                        backgroundColor="rgba(88, 8, 16, 0.22)"
                        color="rgba(245, 240, 233, 0.50)"
                        textColor="#F5F0E9"
                        onClick={confirmarApagarPerido}
                        width="8rem"
                    >
                        Apagar REGISTRO
                    </Button>
                }
            />
        </div>
    )
}

export default CalendarioPage