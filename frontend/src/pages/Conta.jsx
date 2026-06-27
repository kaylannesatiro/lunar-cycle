import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import Button from '../components/common/Buttons/Button'
import Input from '../components/common/Inputs/Input'
import InputSenha from '../components/common/Inputs/InputSenha'
import SelecaoSigno from '../components/common/Inputs/SelecaoSigno'
import CardConfig from '../components/common/Cards/CardConfig'
import PopupAlert from '../components/common/Modals/PopupAlert'
import PopupConfirmacao from '../components/common/Modals/PopupConfirmacao'
import './Conta.css';

const Conta = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    
    const [isSavingPerfil, setIsSavingPerfil] = useState(false)
    const [isSavingSeguranca, setIsSavingSeguranca] = useState(false)
    const [isSavingCiclo, setIsSavingCiclo] = useState(false)

    const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false)

    const [popupAlertConfig, setPopupAlertConfig] = useState({ 
        isOpen: false, 
        title: '', 
        message: '' 
    })
    const [popupConfirmConfig, setPopupConfirmConfig] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        variante: 'confirmacao', 
        textoConfirmar: '', 
        onConfirm: null 
    })

    const [dados, setDados] = useState({
        nome: '',
        signo: '',
        email: '',
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: '',
        duracaoCiclo: 28,
        duracaoMenstruacao: 5
    })

    useEffect(() => {
        const carregarPerfil = async () => {
            try {
                const perfil = await authService.obterPerfil()
                setDados(prev => ({ ...prev, ...perfil }))
            } catch (error) {
                console.error("Erro ao carregar perfil:", error)
            } finally {
                setIsLoading(false)
            }
        }

        carregarPerfil()
    }, [])

    const atualizarDado = (campo, valor) => {
        setDados(prev => ({ ...prev, [campo]: valor }))
    }

    const exibirSucesso = () => {
        setPopupAlertConfig({
            isOpen: true,
            title: "DADOS SALVOS",
            message: "Você atualizou seus dados com sucesso."
        })
    }

    const exibirErro = (mensagemCustomizada, acaoTentarNovamente = null) => {
        setPopupConfirmConfig({
            isOpen: true,
            title: "DADOS NÃO SALVOS",
            message: mensagemCustomizada || "Ocorreu um problema ao atualizar seus dados.",
            variante: "erro",
            textoConfirmar: "TENTAR NOVAMENTE",
            onConfirm: acaoTentarNovamente
        })
    }

    const fecharAlert = () => setPopupAlertConfig(prev => ({ ...prev, isOpen: false }))
    const fecharConfirm = () => setPopupConfirmConfig(prev => ({ ...prev, isOpen: false }))

    const handleSalvarPerfil = async () => {
        try {
            setIsSavingPerfil(true)
            await authService.atualizarPerfil({ nome: dados.nome, signo: dados.signo })
            exibirSucesso()
        } catch (error) {
            exibirErro(null, handleSalvarPerfil)
        } finally {
            setIsSavingPerfil(false)
        }
    }

    const handleSalvarSeguranca = async () => {
        if (mostrarCamposSenha) {
            if (dados.novaSenha && dados.novaSenha !== dados.confirmarNovaSenha) {
                return exibirErro("A nova senha e a confirmação não coincidem.", handleSalvarSeguranca)
            }
            if (dados.novaSenha && !dados.senhaAtual) {
                return exibirErro("Digite sua senha atual para alterar a senha.", handleSalvarSeguranca)
            }
        }

        try {
            setIsSavingSeguranca(true) 
            const payload = { email: dados.email }

            if (mostrarCamposSenha && dados.novaSenha) {
                payload.senhaAtual = dados.senhaAtual
                payload.novaSenha = dados.novaSenha
            }
            
            await authService.atualizarPerfil(payload)
            exibirSucesso()
            
            setDados(prev => ({ ...prev, senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' }))
            setMostrarCamposSenha(false)
            
        } catch (error) {
            exibirErro(error.message || "Ocorreu um problema ao atualizar suas credenciais.", handleSalvarSeguranca)
        } finally {
            setIsSavingSeguranca(false) 
        }
    }

    const handleSalvarCiclo = async () => {
        try {
            setIsSavingCiclo(true) 
            await authService.atualizarPerfil({ 
                duracaoCiclo: Number(dados.duracaoCiclo), 
                duracaoMenstruacao: Number(dados.duracaoMenstruacao) 
            })
            exibirSucesso()
        } catch (error) {
            exibirErro(null, handleSalvarCiclo)
        } finally {
            setIsSavingCiclo(false) 
        }
    }

    const handleLogout = () => {
        setPopupConfirmConfig({
            isOpen: true,
            title: "CONFIRMAR SAIR",
            message: "Tem certeza que deseja apagar sair? Você terá que entrar novamente.",
            variante: "confirmacao",
            textoConfirmar: "SAIR DA CONTA",
            onConfirm: () => {
                localStorage.removeItem('token')
                navigate('/login')
            }
        })
    }

    const handleExcluirConta = () => {
        setPopupConfirmConfig({
            isOpen: true,
            title: "CONFIRMAR EXCLUSÃO",
            message: <>Tem certeza que deseja apagar esta conta? <b>ESTA AÇÃO NÃO PODE SER DESFEITA.</b></>,
            variante: "perigo",
            textoConfirmar: "APAGAR CONTA",
            onConfirm: async () => {
                try {
                    await authService.excluirConta()
                    localStorage.removeItem('token')
                    navigate('/cadastro')
                } catch (error) {
                    exibirErro(`Erro ao excluir conta: ${error.message}`)
                }
            }
        })
    }

    const camposPerfil = [
        {
            label: "NOME DE EXIBIÇÃO",
            input: (
                <Input 
                    type="text" 
                    variante="configuracao" 
                    value={dados.nome} 
                    onChange={(e) => atualizarDado('nome', e.target.value)} 
                />
            )
        },
        {
            label: "SIGNO",
            input: (
                <SelecaoSigno 
                    value={dados.signo} 
                    onChange={(valor) => atualizarDado('signo', valor)} 
                />
            )
        }
    ]

    const camposSeguranca = [
        {
            label: "EMAIL",
            input: (
                <Input 
                    type="email" 
                    variante="configuracao" 
                    value={dados.email} 
                    onChange={(e) => atualizarDado('email', e.target.value)} 
                />
            )
        }
    ]

    if (!mostrarCamposSenha) {
        camposSeguranca.push({
            label: "", 
            input: (
                <Button 
                    variant="padrao" 
                    onClick={() => setMostrarCamposSenha(true)} 
                    backgroundColor="transparent" 
                    color="rgba(224, 197, 143, 0.40)" 
                    textColor="#E0C58F"
                    maxWidth="100%"
                >
                    ◈ Mudar Senha
                </Button>
            )
        })
    } 
    else {
        camposSeguranca.push(
            {
                label: "SENHA ATUAL",
                input: (
                    <InputSenha 
                        variante="configuracao" 
                        placeholder="Digite a senha atual" 
                        value={dados.senhaAtual} 
                        onChange={(e) => atualizarDado('senhaAtual', e.target.value)} 
                    />
                )
            },

            {
                label: "NOVA SENHA",
                input: (
                    <InputSenha 
                        variante="configuracao" 
                        placeholder="Digite sua nova senha" 
                        value={dados.novaSenha} 
                        onChange={(e) => atualizarDado('novaSenha', e.target.value)} 
                    />
                )
            },

            {
                label: "CONFIRMAR SENHA",
                input: (
                    <InputSenha 
                        variante="configuracao" 
                        placeholder="Confirme sua nova senha" 
                        value={dados.confirmarNovaSenha} 
                        onChange={(e) => atualizarDado('confirmarNovaSenha', e.target.value)} 
                    />
                )
            }
        )
    }

    const camposCiclo = [
        {
            label: "DIAS DO CICLO",
            input: (
                <Input 
                    type="number" 
                    variante="configuracao-numero" 
                    value={dados.duracaoCiclo} 
                    onChange={(e) => atualizarDado('duracaoCiclo', e.target.value)} 
                />
            )
        },
        {
            label: "DIAS DA MENSTRUAÇÃO",
            input: (
                <Input 
                    type="number" 
                    variante="configuracao-numero" 
                    value={dados.duracaoMenstruacao} 
                    onChange={(e) => atualizarDado('duracaoMenstruacao', e.target.value)} 
                />
            )
        }
    ]

    if (isLoading) return <div className="conta-loading">✦ Aguarde um momento, estamos buscando suas informações cósmicas ✦</div>;

    return (
        <div className="conta-page-container">
            <header className="conta-header">
                <div className="conta-badge-container">
                    <p className="conta-badge">✦ CONFIGURAÇÕES LUNARES ✦</p>
                </div>
                
                <div className="conta-titulo-container">
                    <h1 className="conta-titulo">PERSONALIZE SUA JORNADA<br/>CÓSMICA</h1>
                </div>
            </header>

            <div className="conta-conteudo">
                <CardConfig 
                    titulo="PERFIL" 
                    campos={camposPerfil} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarPerfil} 
                            isLoading={isSavingPerfil}
                            maxWidth="100%"
                        >
                            ◈ SALVAR PERFIL
                        </Button>
                    }
                />

                <CardConfig 
                    titulo="SEGURANÇA" 
                    campos={camposSeguranca} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarSeguranca} 
                            isLoading={isSavingSeguranca}
                            maxWidth="100%"
                        >
                            ◈ Atualizar credenciais
                        </Button>
                    }
                />

                <CardConfig 
                    titulo="CICLO" 
                    campos={camposCiclo} 
                    camposDuplos={true} 
                    botao={
                        <Button 
                            variant="padrao" 
                            onClick={handleSalvarCiclo} 
                            isLoading={isSavingCiclo}
                            maxWidth="100%"
                        >
                            ◈ Salvar ciclo
                        </Button>
                    }
                />

                <div className="conta-actions-footer">
                    <Button 
                        variant="redondo" 
                        backgroundColor="rgba(88, 8, 16, 0.22)" 
                        color="rgba(245, 240, 233, 0.50)" 
                        textColor="#F5F0E9"
                        onClick={handleExcluirConta}
                    >
                        ◈ APAGAR CONTA
                    </Button>
                    
                    <Button 
                        variant="redondo" 
                        color="#E0C58F" 
                        textColor="#F5F0E9"
                        onClick={handleLogout}
                    >
                        ◈ SAIR DA CONTA
                    </Button>
                </div>
            </div>

            <PopupAlert
                isOpen={popupAlertConfig.isOpen}
                title={popupAlertConfig.title}
                message={popupAlertConfig.message}
                onClose={fecharAlert}
                botao={
                    <Button 
                        variant="padrao" 
                        width="180px"
                        backgroundColor="transparent"
                        color="rgba(224, 197, 143, 0.25)"
                        textColor="#E0C58F"
                        onClick={fecharAlert}
                    >
                        OK
                    </Button>
                }
            />

            <PopupConfirmacao
                isOpen={popupConfirmConfig.isOpen}
                title={popupConfirmConfig.title}
                message={popupConfirmConfig.message}
                variante={popupConfirmConfig.variante}
                onCancel={fecharConfirm}
                botaoCancelar={
                    <Button
                        variant="padrao"
                        width="160px"
                        backgroundColor="linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)"
                        color="rgba(224, 197, 143, 0.50)"
                        textColor="#E0C58F"
                        onClick={fecharConfirm}

                    >
                        CANCELAR
                    </Button>
                }

                botaoConfirmar={
                    <Button
                        variant="padrao"
                        width="180px"
                        backgroundColor={popupConfirmConfig.variante === 'perigo' ? 'rgba(88, 8, 16, 0.25)' : 'linear-gradient(135deg, rgba(224, 197, 143, 0.13) 0%, rgba(224, 197, 143, 0.05) 100%)'}
                        color={popupConfirmConfig.variante === 'perigo' ? 'rgba(215, 75, 85, 0.3)' : 'rgba(224, 197, 143, 0.50)'}

                        textColor={popupConfirmConfig.variante === 'perigo' ? '#F5F0E9' : '#E0C58F'}
                        onClick={() => {
                            if (popupConfirmConfig.onConfirm) popupConfirmConfig.onConfirm();
                            fecharConfirm();
                        }}
                    >
                        {popupConfirmConfig.textoConfirmar}
                    </Button>
                }
            />
        </div>
    )
}

export default Conta